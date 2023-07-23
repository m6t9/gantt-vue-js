<template>
  <div id="app">

    <div class="work_diagramm_box_container" v-if="date_begin_contract">

      <div>
        <table
            v-if="svg_width"
            class="ganttFixHead"
            :style="'width:'+svg_width+'px;'"
            cellspacing="0"
            cellpadding="0"
        >
          <tr class="ganttHead1">
            <th></th>
            <th
                v-for="(item,idx) in months_array"
                :colspan="item.colspan"
                :style="'width: '+zoom+'px;'"
            >{{ item.month }} {{ item.year }}
            </th>
          </tr>
          <tr class="ganttHead2">
            <th
                colspan="1"
                :style="'width: '+zoom+'px;'"
                class="first_num"
            ></th>
            <th v-for="(item,idx) in days_array"
                colspan="1"
                :style="'width: '+ zoom +'px;'"
                :class="{'holy': item.holiday}"
            >{{ item.dd }}
            </th>
          </tr>
        </table>
      </div>

      <div class="work_diagramm_box">
        <svg
            v-on:mouseup.stop.prevent="svg_mouseup($event)"
            v-on:mouseleave.stop.prevent="svg_mouseleave($event)"
            v-on:mousemove.stop.prevent="svg_mousemove($event)"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            :width="svg_width"
            :height="svg_height"
            :viewBox="'0 0 ' + svg_width + ' ' + svg_height"
        >
          <defs>
            <pattern id="grid" :width="zoom" :height="zoom" patternUnits="userSpaceOnUse">
              <path :d="'M '+zoom+' 0 L 0 0 0 '+zoom" fill="none" stroke="#ccc" stroke-width="1"></path>
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)"></rect>

          <!-- Связи -->
          <template v-for="(item,idx) in list">
            <g v-if="not_empty(item.parent_id)" class="arrow">
              <path
                  :d="get_arrow(item.parent_id, item)"
                  :data-from="item.parent_id"
                  :data-to="item.id"
                  class="task-link-path"
              ></path>
            </g>
          </template>

          <g v-for="(item, idx) in list" v-bind:key="idx" class="g-work-block">
            <!-- Прямоугольник, Текст, Кружки ... -->
            <svg_block
                :item="item"
                :item_idx="idx"
                :zoom="zoom"
                :width="item.duration*zoom"
                :base_x="(1+item.delta)*zoom"
                :base_y="idx*zoom*2"
            />
          </g>

        </svg>
      </div>

    </div>

    <div class="work_diagramm_controls">
      <a v-on:click.prevent="change_zoom('inc')" class="btn btn-info"
         title="Увеличить">+</a>
      <a v-on:click.prevent="change_zoom('dec')" class="btn btn-info"
         title="Уменьшить">-</a>
      <a v-on:click.prevent="save_list()" class="btn btn-info">Сохранить</a>
    </div>

    <transition name="fade">
      <div :class="['alert', 'alert-' + save_result]" role="alert" v-if="save_result && save_msg!==''">
        {{ save_msg }}
      </div>
    </transition>

  </div>
</template>

<script>
import svg_block from "./components/svg_block.vue";

export default {
  name: 'Gantt',

  components: {svg_block},

  data() {
    return {
      in_list: false,
      date_begin_contract: false,
      zoom: 25,
      in_move: false,
      new_relation: false,

      save_result: false,
      save_msg: "",
    };
  },

  created() {
    let self = this;

    this.axios
        .get(this.config.GanttAjaxUrl)
        .then(function (response) {
          self.date_begin_contract = self.date_format_fn.getDateFromFormat(response.data.date_begin_contract, 'YYYY-MM-DD HH:mm:ss');

          let new_list = [];
          let ids = {};
          for (let i in response.data.list) {
            let row = response.data.list[i];

            row.date_from = self.date_format_fn.getDateFromFormat(row.date_from, 'YYYY-MM-DD HH:mm:ss');
            row.date_to = self.date_format_fn.getDateFromFormat(row.date_to, 'YYYY-MM-DD HH:mm:ss');

            row["id"] = parseInt(row["id"]);

            if (typeof row["parent_id"] != "undefined") {
              row["parent_id"] = parseInt(row["parent_id"]);
            }

            if (typeof row["work_id"] != "undefined") {
              row["work_id"] = parseInt(row["work_id"]);
            }

            row["delta"] = self.date_format_fn.diff_days(self.date_begin_contract, row.date_from);
            row["duration"] = self.date_format_fn.diff_days(row.date_to, row.date_from);

            ids[row.id] = row.id;
            new_list.push(row);
          }

          // Очистка не существующих parents
          for (let i in new_list) {
            if (self.not_empty(new_list[i]["parent_id"])) {
              if (typeof ids[new_list[i]["parent_id"]] == "undefined") {
                new_list[i]["parent_id"] = 0;
              }
            }
          }

          self.in_list = new_list;
        })
        .catch(function (error) {
              console.log(error);
            }
        );
  },

  computed: {
    list() {
      let new_list = this.in_list;

      for (let i in new_list) {
        if (new_list[i].item_type === "work") {
          let work = new_list[i];

          work.delta = -1;
          work.duration = 0;

          for (let j in new_list) {
            if (new_list[j].item_type === "task" && new_list[j].work_id == work.id) {
              let task = new_list[j];

              if (work.delta > task["delta"] || work.delta < 0) {
                work.delta = task["delta"];
              }

              if (work.duration < (task["delta"] + task["duration"])) {
                work.duration = task["delta"] + task["duration"];
              }
            }
          }

          work.duration = work.duration - work.delta;
        }
      }

      return new_list;
    },
    svg_width() {
      var width = 7;
      var new_width = 0;

      let max_date_to = this.date_begin_contract;
      let max_title = 0;

      let list = this.list;
      for (let i in list) {
        if (max_date_to < list[i]["date_to"]) max_date_to = list[i]["date_to"];
        let title_width = list[i]["title"];
        if (!this.not_empty(title_width)) title_width = "";
        title_width = parseInt(1 + title_width.length / 3);
        if (max_title < title_width) max_title = title_width;
      }
      width = width + this.date_format_fn.diff_days(this.date_begin_contract, max_date_to);

      if (width < 30) width = 30;

      width = width + max_title;

      width = this.zoom * width + 2;
      return width;
    },
    svg_height() {
      var h = this.list.length;
      h = (h * 2 + 1) * this.zoom + 2;
      return h;
    },
    days_array() {
      var da = {};
      if (this.zoom < 1) return da;

      for (let step = 1; step < this.svg_width / this.zoom - 1; step++) {
        let full = this.date_format_fn.addDays(this.date_begin_contract, step - 1);

        da[step] = {
          full: full,
          dd: full.getDate(),
          holiday: this.date_format_fn.is_weekend(full),
          month: this.date_format_fn.get_month_ru(full, "full"),
          year: full.getFullYear(),
          step: step
        };
      }
      return da;
    },
    months_array() {
      var da = {};
      for (let i in this.days_array) {
        let month = this.days_array[i]["month"];
        if (typeof da[month] == "undefined") {
          da[month] = {
            full: this.days_array[i]["full"],
            month: month,
            colspan: 1,
            year: this.days_array[i]["year"]
          };
        } else {
          da[month]["colspan"]++;
        }
      }
      return da;
    }
  },


  methods: {

    // Дочерние начинаются с конца parent
    child_after_parent() {
      for (let i in this.list) {
        let parent_delta = this.get_parent_id_delta(
            this.list[i]["parent_id"]
        );
        if (parent_delta > -1) {
          this.$set(this.list[i], "delta", parent_delta);
        }
      }
    },

    // Поиск индекса Задачи по id
    get_task_list_id_index(id) {
      for (let i in this.list) {
        if (
            typeof this.list[i]["id"] != "undefined" &&
            this.list[i]["id"] == id
        )
          return i;
      }
      return -1;
    },

    get_parent_id_delta(id) {
      if (this.not_empty(id)) {
        let ind = this.get_task_list_id_index(id);
        if (ind > -1) {
          return (
              parseInt(this.list[ind]["delta"]) +
              parseInt(this.list[ind]["duration"])
          );
        }
      }
      return -1;
    },

    to_float(n) {
      n = parseFloat(n);
      if (isNaN(n)) n = 0;
      return n;
    },
    change_zoom(op) {
      if (op == "inc") {
        this.zoom = this.zoom + 5;
      }
      if (op == "dec" && this.zoom > 15) {
        this.zoom = this.zoom - 5;
      }
    },

    // Кнопка мыши отжата
    svg_mouseup(evt) {
      this.in_move = false;
    },
    // Курсор мыши ушел
    svg_mouseleave(evt) {
      this.in_move = false;
    },
    // Кнопка мыши нажата
    rect_down(idx, type, evt) {
      this.in_move = {
        type: type,
        mousedown: evt,
        el_idx: idx,
        base_x: evt.clientX,
        base_y: evt.clientY,
        init_delta: parseInt(this.list[idx]["delta"]),
        init_duration: parseInt(this.list[idx]["duration"])
      };
    },
    // Перемещение мыши
    svg_mousemove(evt) {
      let new_list = this.in_list;
      var move_x = 0;

      // текущее смещение
      if (this.in_move && typeof this.in_move == "object") {
        this.in_move.mousemove = evt;
        var move_x = parseInt((evt.clientX - this.in_move.base_x) / this.zoom);
      }

      // === Перемещение
      if (this.in_move && typeof this.in_move == "object" && this.in_move.type == "move") {

        // Предотвращение смещения < 0
        while (new_list[this.in_move.el_idx]["delta"] + move_x < 0) {
          move_x = move_x + 1;
        }
        // Предотвращение смещения < начала родителя
        let parent_delta = this.get_parent_id_delta(
            new_list[this.in_move.el_idx]["parent_id"]
        );
        while (parent_delta > -1 && parent_delta > new_list[this.in_move.el_idx]["delta"] + move_x) {
          move_x = move_x + 1;
        }
        // Смещение
        if (Math.abs(move_x) > 0) {
          if (new_list[this.in_move.el_idx]["item_type"] == "task") {
            new_list[this.in_move.el_idx]["delta"] = this.to_float(new_list[this.in_move.el_idx]["delta"]) + move_x;
          } else {
            this.work_move_trail(new_list[this.in_move.el_idx]["id"], move_x);
          }

          this.in_move.base_x = evt.clientX;

          this.parent_move_trail(new_list[this.in_move.el_idx]["id"], move_x);
          this.child_after_parent();
        }

      }

      // === Размер
      if (this.in_move && typeof this.in_move == "object" && this.in_move.type == "resize") {

        // duration < 1
        while (new_list[this.in_move.el_idx]["duration"] + move_x < 1) {
          move_x = move_x + 1;
        }

        // Размер
        if (Math.abs(move_x) > 0) {
          new_list[this.in_move.el_idx]["duration"] = this.to_float(new_list[this.in_move.el_idx]["duration"]) + move_x;
        }
      }

      // новое положение курсора
      if (this.in_move && typeof this.in_move == "object" && Math.abs(move_x) > 0) {
        this.in_move.base_x = evt.clientX;
        this.in_move.base_y = evt.clientY;
      }
    },

    // Перемещение "Вслед за parent"
    parent_move_trail(parent_id, move_x) {
      if (this.not_empty(parent_id)) {
        for (let i in this.list) {
          // Вслед за parent
          if (this.not_empty(this.list[i]["parent_id"]) && this.list[i]["parent_id"] == parent_id) {
            this.list[i]["srok_delta"] = this.to_float(this.list[i]["srok_delta"]) + move_x;
            // рекурсия
            this.parent_move_trail(this.list[i]["id"], move_x);
          }
        }
      }
    },

    // Перемещение "Вслед за Работой"
    work_move_trail(work_id, move_x) {
      if (this.not_empty(work_id)) {
        for (let i in this.list) {
          // Вслед за
          if (this.list[i]["work_id"] == work_id) {
            this.$set(this.list[i], "delta", this.to_float(this.list[i]["delta"]) + move_x);
          }
        }
      }
    },

    // Дочерние начинаются с конца parent
    сhild_after_parent() {
      let new_list = this.in_list;
      for (let i in new_list) {
        let parent_delta = this.get_parent_id_delta(
            new_list[i]["parent_id"]
        );
        if (parent_delta > -1) {
          this.$set(new_list[i], "delta", parent_delta);
        }
      }
    },

    // Нажатие на "Кружок"
    rect_circle_click(pos, idx) {
      var item = this.list[idx];
      // отсоединение
      if (this.not_empty(item["parent_id"]) && pos == "left") {
        this.$set(this.list[idx], "parent_id", 0);
        this.сhild_after_parent();
        return;
      }
      // присоединение 1
      if (!this.new_relation) {
        this.new_relation = {
          item: item,
          idx: idx,
          type: pos
        };
        return;
      } else if (this.new_relation.item.id == item.id) {
        this.new_relation = false;
        return;
      }
      // присоединение 2
      if (this.not_empty(this.new_relation)) {
        if (this.new_relation.type == "left") {
          this.$set(this.list[this.new_relation.idx], "parent_id", item.id);
        } else {
          this.$set(this.list[idx], "parent_id", this.new_relation.item.id);
        }
        this.сhild_after_parent();
        this.new_relation = false;
        return;
      }
    },

    // Найти индекс в массиве по id
    get_id_index(id) {
      for (let i in this.list) {
        if (
            typeof this.list[i]["id"] != "undefined" &&
            this.list[i]["id"] == id
        )
          return i;
      }
      return -1;
    },

    // СТРЕЛКИ
    // from - родитель, to - дочерний элемент
    get_arrow(from_id, to) {
      var from_idx = this.get_id_index(from_id);

      if (from_idx < 0) return "";

      var from = this.list[from_idx];
      var from_x = (1 + this.to_float(from.delta)) * this.zoom + from.duration * this.zoom;
      var from_y = from_idx * this.zoom * 2 + this.zoom / 2;

      var to_idx = this.get_id_index(to.id);
      var to_x = (1 + this.to_float(to.delta)) * this.zoom;
      var to_y = to_idx * this.zoom * 2 + this.zoom / 2;

      var current_x = from_x;
      var current_y = from_y;

      var arrow = "";

      // Шаг по вертикали
      if (to_y > from_y) {
        var step_y = this.zoom / 2;
      } else {
        var step_y = (-1 * this.zoom) / 2;
      }

      // Направление по горизонтали (left/righr)

      // Загиб вниз/вверх
      arrow = arrow + "M " + current_x + "," + current_y + " ";
      current_x = current_x + step_y;
      arrow =
          arrow + "Q " + current_x + " " + current_y + " " + current_x + " ";
      // M 100 100 Q 150 100 150 150
      current_y = current_y + step_y;
      arrow = arrow + current_y + " ";

      if (to_x <= from_x) {
        // Загиб влево
        // Q 150 200 100 200
        current_y = current_y + step_y;
        arrow = arrow + "Q " + current_x + " " + current_y + " ";
        current_x = current_x - step_y;
        arrow = arrow + current_x + " " + current_y + " ";
        // Горизонтальная линия
        // L 50 200
        current_x = to_x;
        arrow = arrow + "L " + current_x + " " + current_y + " ";
        // Загиб влево/низ
        // Q 0 200 0 250
        current_x = current_x - step_y;
        arrow = arrow + "Q " + current_x + " " + current_y + " ";
        current_y = current_y + step_y;
        arrow = arrow + current_x + " " + current_y + " ";
      } else {
      }

      // Вертикальная линия
      // L 0 300
      current_y = to_y - step_y;
      arrow = arrow + "L " + current_x + " " + current_y + " ";

      // Загиб в право
      // Q 0 350 50 350
      current_y = current_y + step_y;
      arrow = arrow + "Q " + current_x + " " + current_y + " ";
      current_x = current_x + step_y;
      arrow = arrow + current_x + " " + current_y + " ";

      // Горизонтальная линия
      // L 100 350
      current_x = to_x;
      arrow = arrow + "L " + current_x + " " + current_y + " ";

      // Стрелка
      arrow =
          arrow +
          "m -" +
          this.zoom / 4 +
          " -" +
          this.zoom / 4 +
          " l " +
          this.zoom / 4 +
          " " +
          this.zoom / 4 +
          " l -" +
          this.zoom / 4 +
          " " +
          this.zoom / 4 +
          " ";

      return arrow;
    },

    save_list() {
      let self = this;

      let data = {
        list: [],
        date_begin_contract: this.date_format_fn.getDateTimeToString(this.date_begin_contract, 'YYYY-MM-DD HH:mm:ss'),
      };
      for (let i in this.list) {
        let list_row = this.list[i];

        let row = {
          id: list_row.id,
          item_type: list_row.item_type,
          title: list_row.title
        };

        if (typeof list_row["parent_id"] != "undefined") {
          row["parent_id"] = list_row["parent_id"]
        }

        if (typeof list_row["work_id"] != "undefined") {
          row["work_id"] = list_row["work_id"];
        }

        row.date_from = this.date_format_fn.addDays(this.date_begin_contract, list_row.delta);
        row.date_from = this.date_format_fn.getDateTimeToString(row.date_from, 'YYYY-MM-DD HH:mm:ss');

        row.date_to = this.date_format_fn.addDays(this.date_begin_contract, list_row.delta + list_row.duration);
        row.date_to = this.date_format_fn.getDateTimeToString(row.date_to, 'YYYY-MM-DD HH:mm:ss');

        data.list.push(row);
      }

      this.save_result = false;
      this.save_msg = "";

      this.axios
          .post(this.config.GanttAjaxUrl, JSON.stringify(data))
          .then(function (response) {
            if (typeof response.data['success'] != "undefined" && response.data['success']) {
              self.save_result = "success";
              self.save_msg = "Данные сохранены.";
            } else {
              self.save_result = "danger";
              self.save_msg = "Не сохранено: Серверная ошибка.";
              if (typeof response.data['msg'] != "undefined") {
                self.save_msg = response.data['msg'];
              }
            }

            setTimeout(() => {
              self.save_result = false;
              self.save_msg = "";
            }, 4000);

          })
          .catch(function (error) {
                console.log(error);
              }
          );
    }


  }


};
</script>
<style scoped>

/* календарь */
.ganttFixHead {
  top: 0;
  height: 24px;
}

.ganttHead1 {
  height: 38px;
}

.ganttHead2 {
  height: 20px;
}


.ganttHead1 th {
  padding: 0;
  margin: 0;
  border: 1px solid #ddd;
  background: #f4f4f4;
  text-align: center;
  font-weight: normal;
  font-size: 12px;
}

.ganttHead2 th {
  padding: 0;
  margin: 0;

  background: #f4f4f4;
  text-align: center;
  border: 1px solid #ddd;
  font-weight: normal;
  font-size: 10px;
  overflow: hidden;
}

.ganttHead2 th.holy {
  background-color: rgba(255, 99, 57, 0.4);
}

/* Связи */

.task-link-path {
  fill: none;
  stroke-width: 5px;
  stroke: rgba(47, 151, 198, 0.7);
}

/* */

.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

/* */

</style>
