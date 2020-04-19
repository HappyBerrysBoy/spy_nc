$(function () {
  "use strict";

  // 시작시 기본 설정 기능///////////////////////////////////////////
  $('[data-toggle="offcanvas"]').on("click", function () {
    $(".offcanvas-collapse").toggleClass("open");
  });

  $("#mainMenu").html("");

  Object.keys(menuArray).forEach((menu) => {
    $("#mainMenu").append(
      $("#mainMenuComponent")
        .html()
        .replace(/{{name}}/g, menuArray[menu].name)
        .replace(/{{active}}/g, menuArray[menu].active)
        .replace(/{{caption}}/g, menuArray[menu].caption)
    );

    if (menuArray[menu].active == "active") {
      menuArray[menu].onload();
    }
  });

  $(".nav-item").on("click", function () {
    $(".nav-item").each((idx, item) => {
      $(item).removeClass("active");
    });

    $(this).addClass("active");
    menuArray[$(this).attr("data-menu")].onload();

    $(".offcanvas-collapse").toggleClass("open");
  });
  // 시작시 기본 설정 기능 완료!! ///////////////////////////////////////////

  // 여기서부터는 알아서 코딩!!! 위쪽으로는 안건드리는게 좋음..!!////////////////
});

// 각자 js file에서 설정
const menuArray = {
  nextColony: nextColony,
};
