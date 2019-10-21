let self;

const storageId = "users";
const saveCount = 5;

const nextColony = {
  name: "nextColony",
  caption: "Next Colony",
  active: "active",
  onload() {
    this.setSubMenu();
    self = this;

    let firstAccount = "";
    if (localStorage.getItem(storageId)) {
      let users = localStorage.getItem(storageId).split(",");
      users.forEach((user, idx) => {
        if (idx == 0) {
          firstAccount = user;
        }
        $("#accountShortcut").append(
          componentFormats.userShortcut.replace(/{{account}}/g, user),
        );
      });
    }

    $(".shortcut").on("click", function() {
      $("#inputAccount").val($(this).text());
      $("#loadAccount").trigger("click");
    });

    $("#inputAccount").val(firstAccount);
    $("#loadAccount").trigger("click");
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
            componentFormats.planetDetailComponent,
        );

        $("#loadAccount").on("click", function() {
          self.loadPlanets();

          const selId = $("#inputAccount").val();

          if (localStorage.getItem(storageId)) {
            let users = localStorage.getItem(storageId).split(",");

            if (users.includes(selId)) return;

            users.push(selId);

            if (users.length > saveCount) {
              users.shift();
            }
            localStorage.setItem(storageId, users);

            $("#accountShortcut").append(
              componentFormats.userShortcut.replace(/{{account}}/g, selId),
            );

            $(".shortcut").off("click");
            $(".shortcut").on("click", function() {
              $("#inputAccount").val($(this).text());
              $("#loadAccount").trigger("click");
            });
          } else {
            localStorage.setItem(storageId, [selId]);
          }
        });

        $("#calcTime").on("click", function() {
          try {
            const planet1X = parseInt($("#planet1X").val());
            const planet1Y = parseInt($("#planet1Y").val());
            const planet2X = parseInt($("#planet2X").val());
            const planet2Y = parseInt($("#planet2Y").val());
            const speed = parseInt($("#speed").val());

            const calcResult =
              Math.sqrt(
                (planet1X - planet2X) ** 2 + (planet1Y - planet2Y) ** 2,
              ) / speed;
            const minutes = (calcResult % 1) * 60;

            $("#calcResult").val(calcResult);
            $("#resultTime").val(
              `${Math.floor(calcResult)}시간 ${Math.floor(minutes)}분 ${(
                (minutes % 1) *
                60
              ).toFixed(0)}초`,
            );
          } catch (e) {
            console.log(e);
            $("#calcResult").val(e);
          }
        });
      },
    },
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
      l.data.planets.sort(function(a,b) {
        return (a.date < b.date) ? -1 : a.date > b.date ? 1 : 0;
      });
      l.data.planets.forEach((value, index, array) => {
        $("#planetList").append(
          componentFormats.planetListItem
            .replace(/{{count}}/g, index+1)
            .replace(/{{id}}/g, l.data.planets[index].id)
            .replace(/{{name}}/g, l.data.planets[index].name)
            .replace(/{{x}}/g, l.data.planets[index].posx)
            .replace(/{{y}}/g, l.data.planets[index].posy)
            .replace(/{{starter}}/g, l.data.planets[index].starter == 1),
        );
      });

      $(".planetId").on("click", async function() {
        $("#planetDetail").html("");

        axios
          .all([
            loadplanet($(this).attr("data-id")),
            loadqyt($(this).attr("data-id")),
            loadFleet($("#inputAccount").val(), $(this).attr("data-id")),
            fleetMissionOutgoing(
              $("#inputAccount").val(),
              $(this).attr("data-id"),
            ),
          ]) // axios.all로 여러 개의 request를 보내고
          .then(
            axios.spread((a, b, c, d) => {
              // Planet Info
              let planetInfo = a.data;
              $("#planetDetail").append(
                componentFormats.planetBasicInfo
                  .replace(/{{base}}/g, planetInfo.level_base)
                  .replace(/{{coal}}/g, planetInfo.level_coal)
                  .replace(/{{ore}}/g, planetInfo.level_ore)
                  .replace(/{{copper}}/g, planetInfo.level_copper)
                  .replace(/{{uranium}}/g, planetInfo.level_uranium)
                  .replace(/{{coaldepot}}/g, planetInfo.level_coaldepot)
                  .replace(/{{oredepot}}/g, planetInfo.level_oredepot)
                  .replace(/{{copperdepot}}/g, planetInfo.level_copperdepot)
                  .replace(/{{uraniumdepot}}/g, planetInfo.level_uraniumdepot)
                  .replace(/{{shipyard}}/g, planetInfo.level_ship)
                  .replace(/{{research}}/g, planetInfo.level_research)
                  .replace(/{{rarity}}/g, planetInfo.planet_rarity),
              );

              // Planet Quantity
              let loadQty = b.data;

              let currDate = +new Date();
              let gap = currDate / 1000 - loadQty.lastUpdate;

              let availCoal =
                loadQty.coal + (gap * loadQty.coalrate) / 24 / 60 / 60;
              let availCopper =
                loadQty.copper + (gap * loadQty.copperrate) / 24 / 60 / 60;
              let availOre =
                loadQty.ore + (gap * loadQty.orerate) / 24 / 60 / 60;
              let availUranium =
                loadQty.uranium + (gap * loadQty.uraniumrate) / 24 / 60 / 60;

              if (availCoal > loadQty.coaldepot) availCoal = loadQty.coaldepot;
              if (availCopper > loadQty.copperdepot)
                availCopper = loadQty.copperdepot;
              if (availOre > loadQty.oredepot) availOre = loadQty.oredepot;
              if (availUranium > loadQty.uraniumdepot)
                availUranium = loadQty.uraniumdepot;

              $("#planetDetail").append(
                componentFormats.planetQtyInfo
                  .replace(/{{coal}}/g, availCoal.toFixed(1))
                  .replace(/{{ore}}/g, availOre.toFixed(1))
                  .replace(/{{copper}}/g, availCopper.toFixed(1))
                  .replace(/{{uranium}}/g, availUranium.toFixed(1))
                  .replace(/{{coaldepot}}/g, loadQty.coaldepot)
                  .replace(/{{oredepot}}/g, loadQty.oredepot)
                  .replace(/{{copperdepot}}/g, loadQty.copperdepot)
                  .replace(/{{uraniumdepot}}/g, loadQty.uraniumdepot),
              );

              // Planet Ship Info
              let map = new Map();
              c.data.forEach(v => {
                if (map.has(v.type)) {
                  map.set(v.type, {
                    ttl: map.get(v.type)["ttl"] + 1,
                    leave: 0,
                  });
                } else {
                  map.set(v.type, { ttl: 1, leave: 0 });
                }
              });

              d.data.forEach(v => {
                const ships = v.ships;
                console.log(`ships:${ships}`);

                Object.keys(v.ships).forEach(ship => {
                  if (ship === "total") return;

                  if (
                    v.type === "deploy" ||
                    v.type === "siege" ||
                    v.type === "attack"
                  ) {
                    if (
                      planetInfo.planet_corx !== v.start_x ||
                      planetInfo.planet_cory !== v.start_y
                    )
                      return;
                  }

                  if (map.has(ship)) {
                    map.set(ship, {
                      ttl: map.get(ship).ttl + ships[ship].n,
                      leave: map.get(ship).leave + ships[ship].n,
                    });
                  } else {
                    map.set(ship, {
                      ttl: ships[ship].n,
                      leave: ships[ship].n,
                    });
                  }
                });
              });

              $("#planetDetail").append(componentFormats.planetShipInfo);

              for (var [keyinfo, value] of map.entries()) {
                $("#shipDetailInfo").append(
                  componentFormats.detailRow
                    .replace(/{{name}}/g, keyinfo)
                    .replace(/{{val}}/g, `${value.leave}/${value.ttl}`),
                );
              }

              $("#planetDetail").append(componentFormats.planetFleetInfo);

              d.data.forEach(v => {
                const ships = v.ships;
                console.log(`ships:${ships}`);

                let content = "";
                let toInfo = "";

                if (v.type == "explorespace") {
                  toInfo = `(${v.end_x},${v.end_y})`;
                } else if (
                  v.type == "attack" ||
                  v.type == "siege" ||
                  v.type == "deploy"
                ) {
                  Object.keys(v.ships).forEach(ship => {
                    if (ship === "total") return;

                    content += `${ship}:Count(${ships[ship].n}), Position(${ships[ship].pos}) \n`;
                  });

                  toInfo = `${v.to_planet.user}, ${v.to_planet.name}(${v.end_x},${v.end_y})`;
                }

                $("#leaveShipDetailInfo").append(
                  componentFormats.detailFleetRow
                    .replace(/{{type}}/g, v.type)
                    .replace(/{{to}}/g, toInfo)
                    .replace(
                      /{{arrival}}/g,
                      new Date(v.arrival * 1000).toLocaleString(),
                    )
                    .replace(
                      /{{return}}/g,
                      v.return
                        ? new Date(v.return * 1000).toLocaleString()
                        : "-",
                    )
                    .replace(/{{content}}/g, content),
                );
              });
            }),
          )
          .catch(error => {
            console.error(error);
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
  },
};
