let self;

const nextColony = {
  name: "nextColony",
  caption: "Next Colony",
  active: "active",
  onload() {
    this.setSubMenu();
    self = this;
  },
  subMenu: {
    account: {
      caption: "Account",
      active: "active",
      goPageUrl: "#",
      newCount: "",
      onload() {
        $("#content").html("");

        $("#content").append(
          componentFormats.inputComponent.replace(/{{account}}/g, "") +
            componentFormats.planetComponent +
            componentFormats.planetDetailComponent
        );

        $("#loadAccount").on("click", function() {
          self.loadPlanets();
        });
      }
    }
  },
  loadPlanets() {
    if (
      $("#inputAccount")
        .val()
        .trim().length < 1
    )
      return;

    $("#planetList").html("");
    loadplanets($("#inputAccount").val()).then(l => {
      if (l.data.planets.length == 0) return;
      l.data.planets.forEach(p => {
        $("#planetList").append(
          componentFormats.planetListItem
            .replace(/{{id}}/g, p.id)
            .replace(/{{name}}/g, p.name)
            .replace(/{{x}}/g, p.posx)
            .replace(/{{y}}/g, p.posy)
            .replace(/{{starter}}/g, p.starter == 1)
        );
      });

      $(".planetId").on("click", async function() {
        $("#planetDetail").html("");

        await loadplanet($(this).attr("data-id"))
          .then(d => {
            let data = d.data;
            $("#planetDetail").append(
              componentFormats.planetBasicInfo
                .replace(/{{base}}/g, data.level_base)
                .replace(/{{coal}}/g, data.level_coal)
                .replace(/{{ore}}/g, data.level_ore)
                .replace(/{{copper}}/g, data.level_copper)
                .replace(/{{uranium}}/g, data.level_uranium)
                .replace(/{{coaldepot}}/g, data.level_coaldepot)
                .replace(/{{oredepot}}/g, data.level_oredepot)
                .replace(/{{copperdepot}}/g, data.level_copperdepot)
                .replace(/{{uraniumdepot}}/g, data.level_uraniumdepot)
                .replace(/{{shipyard}}/g, data.level_ship)
                .replace(/{{research}}/g, data.level_research)
                .replace(/{{rarity}}/g, data.planet_rarity)
            );
          })
          .catch(e => {
            console.log(e);
            alert("Fail to load data");
          });

        await loadqyt($(this).attr("data-id"))
          .then(d => {
            let data = d.data;

            let currDate = +new Date();
            let gap = currDate / 1000 - data.lastUpdate;

            let availCoal = data.coal + (gap * data.coalrate) / 24 / 60 / 60;
            let availCopper =
              data.copper + (gap * data.copperrate) / 24 / 60 / 60;
            let availOre = data.ore + (gap * data.orerate) / 24 / 60 / 60;
            let availUranium =
              data.uranium + (gap * data.uraniumrate) / 24 / 60 / 60;

            if (availCoal > data.coaldepot) availCoal = data.coaldepot;
            if (availCopper > data.copperdepot) availCopper = data.copperdepot;
            if (availOre > data.oredepot) availOre = data.oredepot;
            if (availUranium > data.uraniumdepot)
              availUranium = data.uraniumdepot;

            $("#planetDetail").append(
              componentFormats.planetQtyInfo
                .replace(/{{coal}}/g, availCoal.toFixed(1))
                .replace(/{{ore}}/g, availOre.toFixed(1))
                .replace(/{{copper}}/g, availCopper.toFixed(1))
                .replace(/{{uranium}}/g, availUranium.toFixed(1))
                .replace(/{{coaldepot}}/g, data.coaldepot)
                .replace(/{{oredepot}}/g, data.oredepot)
                .replace(/{{copperdepot}}/g, data.copperdepot)
                .replace(/{{uraniumdepot}}/g, data.uraniumdepot)
            );
          })
          .catch(e => {
            console.log(e);
            alert("Fail to load data");
          });

        await loadFleet($("#inputAccount").val(), $(this).attr("data-id"))
          .then(d => {
            let map = new Map();
            d.data.forEach(v => {
              if (map.has(v.longname)) {
                map.set(v.longname, map.get(v.longname) + 1);
              } else {
                map.set(v.longname, 1);
              }
            });

            $("#planetDetail").append(componentFormats.planetFleetInfo);

            for (var [keyinfo, value] of map.entries()) {
              $("#shipDetailInfo").append(
                componentFormats.detailRow
                  .replace(/{{name}}/g, keyinfo)
                  .replace(/{{val}}/g, value)
              );
            }
          })
          .catch(e => {
            console.log(e);
            alert("Fail to load data");
          });
      });
    });
  },
  setSubMenu() {
    // Menu 배치
    const self = this;

    $("#subMenu").html("");
    let menuHtml = "";
    Object.keys(self.subMenu).forEach(function(menu) {
      menuHtml += $("#subMenuComponent")
        .html()
        .replace(/{{name}}/g, menu)
        .replace(/{{goPageUrl}}/g, self.subMenu[menu].goPageUrl)
        .replace(/{{caption}}/g, self.subMenu[menu].caption)
        .replace(/{{newCount}}/g, self.subMenu[menu].newCount);
    });

    $("#subMenu").append(menuHtml);

    Object.keys(self.subMenu).forEach(function(menu) {
      if (self.subMenu[menu].active == "active") {
        self.subMenu[menu].onload();
      }
    });

    $(".sub.nav-link").on("click", function() {
      $(".sub.nav-link").each(function(idx, item) {
        $(item).removeClass("active");
      });

      $(this).addClass("active");
      self.subMenu[$(this).attr("data-submenu")].onload();
    });
  }
};
