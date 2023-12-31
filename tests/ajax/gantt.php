<?php
header('Access-Control-Allow-Origin: *');
if (!empty($_POST)){
    die(json_encode(['success'=>true]));
}
?>
{
  "list": [
    {
      "id": "23036",
      "title": "Схема на КПТ с выездом (район)",
      "item_type": "work",
      "date_from": "2021-12-03 15:19:57",
      "date_to": "2022-01-03 15:19:57"
    },
    {
      "id": "136288",
      "title": "Выезд на объект инженера",
      "work_id": "23036",
      "parent_id": "0",
      "item_type": "task",
      "date_from": "2021-12-03 15:19:57",
      "date_to": "2021-12-17 15:19:57"
    },
    {
      "id": "136289",
      "title": "Запрос сведений из кадастра",
      "work_id": "23036",
      "parent_id": "0",
      "item_type": "task",
      "date_from": "2021-12-03 15:19:57",
      "date_to": "2021-12-21 15:19:57"
    },
    {
      "id": "136290",
      "title": "Получение сведений из кадастра",
      "work_id": "23036",
      "parent_id": "0",
      "item_type": "task",
      "date_from": "2021-12-03 15:19:57",
      "date_to": "2021-12-24 15:19:57"
    },
    {
      "id": "136291",
      "title": "Подготовка схемы",
      "work_id": "23036",
      "parent_id": "0",
      "item_type": "task",
      "date_from": "2021-12-03 15:19:57",
      "date_to": "2022-01-03 15:19:57"
    },
    {
      "id": "136292",
      "title": "Уведомление заказчика о получении документов",
      "work_id": "23036",
      "parent_id": "0",
      "item_type": "task",
      "date_from": "2021-12-03 15:19:57",
      "date_to": "2022-01-03 15:19:57"
    },
    {
      "id": "136293",
      "title": "Выдача межевого плана, проекта границ, схемы расположения  на руки заказчику",
      "work_id": "23036",
      "parent_id": "0",
      "item_type": "task",
      "date_from": "2021-12-03 15:19:57",
      "date_to": "2022-01-03 15:19:57"
    },
    {
      "id": "23037",
      "title": "Запрос сведений ИСОГД о принадлежности к территории общего пользования",
      "item_type": "work",
      "date_from": "2021-12-03 14:41:02",
      "date_to": "2021-12-06 09:13:12"
    },
    {
      "id": "136295",
      "title":"Составление заявления",
      "work_id": "23037",
      "parent_id": "0",
      "item_type": "task",
      "date_from": "2022-01-03 15:19:57",
      "date_to": "2022-01-05 15:19:57"
    },
    {
      "id": "136296",
      "title": "Подача документов",
      "work_id": "23037",
      "parent_id": "136295",
      "item_type": "task",
      "date_from": "2022-01-05 15:19:57",
      "date_to": "2022-01-12 15:19:57"
    },
    {
      "id": "136297",
      "title": "Получение документов",
      "work_id": "23037",
      "parent_id": "136296",
      "item_type": "task",
      "date_from": "2022-01-12 15:19:57",
      "date_to": "2022-02-01 15:19:57"
    }
  ],
  "date_begin_contract": "2021-12-03 15:19:57"
}
