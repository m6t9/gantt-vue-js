# gantt-vue-js

## Задача

По ajax доступен массив:
- список работ и задач из которых эти работы состоят
- Дата начала договора
Структуру данных можно увидеть в тестовом файле: public/ajax/gantt.php

Необходим интерактивный редактор в виде диаграммы Гантта:
- Изменение дат начала и длительности задач
- Перерасчет дат начала и длительности работ по задачам, относящимся к этим работам
- Изменение связей задач

Для связанных задач:
- Дочерняя задача начинается на следующий день после окончания родительской

Сохранение результата производится POST запросом по тому-же адресу с данными той-же структуры.

![](https://github.com/m6t9/gantt-vue-js/blob/main/screen.gif)


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
