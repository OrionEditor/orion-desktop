export function deleteOverflowWindow(){
    document.body.style.overflow = 'hidden'; // Отключить прокрутку для всего тела документа
    document.body.style.margin = "0px";
    document.documentElement.style.overflow = 'hidden'; // Отключить прокрутку для корневого элемента
    document.documentElement.style.margin = "0px";
}

export function deleteMarginWindow(){
    document.body.style.margin = "0px";
    document.documentElement.style.margin = "0px";
}