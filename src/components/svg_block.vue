<template>
  <g>

    <!-- Прямоугольник -->
    <rect
      v-on:mousedown.stop.prevent="$parent.rect_down(item_idx, 'move', $event)"
      :x="base_x"
      :y="base_y"
      :width="width"
      :height="zoom"
      stroke
      fill="#09a"
      class="rect-item"
      :class="'rect-item-' + item.item_type"
    ></rect>

    <!-- Текст -->
    <text
      :x="base_x + width + 1*zoom"
      :y="3 + zoom/2 + base_y"
      :font-size="zoom/2"
      fill="#09a"
    >{{ item.title }}
    </text>
    -->

    <!-- Для регулирования ширины -->
    <rect
      v-if="item.item_type == 'task'"
      v-on:mousedown.stop.prevent="$parent.rect_down(item_idx, 'resize', $event)"
      :x="base_x + width - zoom/5"
      :y="base_y"
      :width="zoom/5"
      :height="zoom"
      stroke
      fill="#09F"
      class="rect-item-end"
    ></rect>

    <!-- Кружки -->
    <g v-if="item.item_type == 'task'">
      <a v-on:click.prevent="$parent.rect_circle_click('left', item_idx)" href="#">
        <circle
          :cx="base_x"
          :cy="base_y + zoom/2"
          :r="zoom/5"
          :class="get_rect_circle_class('left', item)"
        ></circle>
      </a>
      <a v-on:click.prevent="$parent.rect_circle_click('right', item_idx)" href="#">
        <circle
          :cx="base_x + width"
          :cy="base_y + zoom/2"
          :r="zoom/5"
          :class="get_rect_circle_class('right', item)"
        ></circle>
      </a>
    </g>

  </g>
</template>
<script>
export default {
  props: {
    item: {default: {}},
    item_idx: {default: 0},
    zoom: {default: 30},
    width: {default: 0},
    base_x: {default: 0},
    base_y: {default: 0}
  },
  data() {
    return {};
  },
  created() {
  },
  methods: {
    init() {
    },
    to_float(n) {
      n = parseFloat(n);
      if (isNaN(n)) n = 0;
      return n;
    },
    get_rect_circle_class(pos, item) {
      var cl = "rect-circle " + "rect-circle-" + pos;
      if (this.not_empty(item.parent_id) && pos == "left") {
        cl = cl + " has-parrent";
      }
      if (
        this.not_empty(this.$parent.new_relation) &&
        item.id == this.$parent.new_relation.item.id &&
        this.$parent.new_relation.type == pos
      ) {
        cl = cl + " new-relation";
      }
      return cl;
    }
  }
};
</script>
<style scoped>
.rect-item {
  cursor: move;
  fill: #09a;
}

.rect-item.rect-item-work {
  fill: #58e022;
}

.rect-item-end {
  cursor: col-resize;
}

.task-link-path {
  fill: none;
  stroke-width: 5px;
  stroke: rgba(47, 151, 198, 0.7);
}

.rect-circle {
  fill: #00b7ff;
  opacity: 0;
}

.rect-circle:hover,
.g-task:hover .rect-circle {
  opacity: 1;
}

.rect-circle.has-parrent {
  fill: red;
}

.rect-circle.new-relation {
  fill: greenyellow;
  opacity: 1;
}
</style>
