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
          componentFormats.inputComponent.replace(/{{account}}/g, ""),
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

    $("#contentBody").html("");

    const account = $("#inputAccount").val();

    loadplanets(account).then(l => {
      if (l.data.planets.length == 0) return;

      $("#contentBody").append(
        componentFormats.planetComponent.replace(
          /{{accountInfo}}/g,
          `${account} < ${l.data.planets.length} >`,
        ) + componentFormats.planetDetailComponent,
      );

      l.data.planets.sort(function(a, b) {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      });
      l.data.planets.forEach((value, index, array) => {
        $("#planetList").append(
          componentFormats.planetListItem
            .replace(/{{count}}/g, index + 1)
            .replace(/{{id}}/g, l.data.planets[index].id)
            .replace(/{{name}}/g, l.data.planets[index].name)
            .replace(/{{x}}/g, l.data.planets[index].posx)
            .replace(/{{y}}/g, l.data.planets[index].posy)
            .replace(/{{starter}}/g, l.data.planets[index].starter == 1),
        );
      });

      // componentFormats.planetComponent
      fleetMission(account).then(missions => {
        console.log("mission", missions);
        $("#contentBody").append(
          componentFormats.missionComponent.replace(
            /{{accountInfo}}/g,
            `${account} <${missions.data.length} missions>`,
          ),
        );

        $("#missionList").html("");

        missions.data.forEach(m => {
          $("#missionList").append(
            componentFormats.missionListItem
              .replace(/{{type}}/g, m.type)
              .replace(/{{from}}/g, m.from_planet.user)
              .replace(/{{origin}}/g, `(${m.start_x}/${m.start_y})`)
              .replace(/{{to}}/g, m.to_planet ? m.to_planet.user : "-")
              .replace(/{{destination}}/g, `(${m.end_x}/${m.end_y})`)
              .replace(/{{ship}}/g, m.ships.total)
              .replace(
                /{{load}}/g,
                m.resources.coal +
                  m.resources.copper +
                  m.resources.ore +
                  m.resources.uranium,
              )
              .replace(
                /{{arrival}}/g,
                `${new Date(m.arrival * 1000).toLocaleString()}`,
              )
              .replace(
                /{{return}}/g,
                m.return
                  ? `${new Date(m.return * 1000).toLocaleString()}`
                  : "-",
              )
              .replace(/{{result}}/g, m.result ? m.result : "-")
              .replace(/{{cancel}}/g, m.cancel_trx ? m.cancel_trx : "-"),
          );
        });
      });

      debugger;

      $(".planetP1").on("click", function() {
        const planetx = $(this)
          .parent()
          .parent()
          .find(".planetX")
          .text();
        const planety = $(this)
          .parent()
          .parent()
          .find(".planetY")
          .text();

        $("#planet1X").val(planetx);
        $("#planet1Y").val(planety);
      });

      $(".planetP2").on("click", function() {
        const planetx = $(this)
          .parent()
          .parent()
          .find(".planetX")
          .text();
        const planety = $(this)
          .parent()
          .parent()
          .find(".planetY")
          .text();

        $("#planet2X").val(planetx);
        $("#planet2Y").val(planety);
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
            loadproduction($(this).attr("data-id"), $("#inputAccount").val()),
            loadskills($("#inputAccount").val()),
          ]) // axios.all로 여러 개의 request를 보내고
          .then(
            axios.spread((a, b, c, d, e, f) => {
              // Planet Info
              let planetInfo = a.data;
              let skillInfo = f.data;
              let cur_time = parseInt(new Date() / 1000);
              let planetInfoStr = `[${planetInfo.planet_id}] ${planetInfo.planet_name} (${planetInfo.planet_corx}/${planetInfo.planet_cory})`;
              $("#planetDetail").append(
                componentFormats.planetBasicInfo
                  .replace(/{{planetinfo}}/g, planetInfoStr)
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
                  .replace(
                    /{{charge}}/g,
                    planetInfo.shieldcharged == 1
                      ? "Charged"
                      : planetInfo.shieldcharge_busy > cur_time
                      ? `Charging (${new Date(
                          planetInfo.shieldcharge_busy * 1000,
                        ).toLocaleString()})`
                      : "Not charged",
                  )
                  .replace(/{{baseSkill}}/g, skillInfo[21].current)
                  .replace(/{{coalSkill}}/g, skillInfo[19].current)
                  .replace(/{{oreSkill}}/g, skillInfo[17].current)
                  .replace(/{{copperSkill}}/g, skillInfo[18].current)
                  .replace(/{{uraniumSkill}}/g, skillInfo[20].current)
                  .replace(/{{coaldepotSkill}}/g, skillInfo[3].current)
                  .replace(/{{oredepotSkill}}/g, skillInfo[1].current)
                  .replace(/{{copperdepotSkill}}/g, skillInfo[2].current)
                  .replace(/{{uraniumdepotSkill}}/g, skillInfo[4].current)
                  .replace(/{{shipyardSkill}}/g, skillInfo[0].current)
                  .replace(/{{researchSkill}}/g, skillInfo[22].current)
                  .replace(
                    /{{protect}}/g,
                    planetInfo.shieldprotection_busy > cur_time
                      ? `Activated (${new Date(
                          planetInfo.shieldprotection_busy * 1000,
                        ).toLocaleString()})`
                      : "Not activated",
                  )
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

              let loadProduct = e.data;
              $("#planetDetail").append(
                componentFormats.planetQtyInfo
                  .replace(/{{planetinfo}}/g, planetInfoStr)
                  .replace(/{{coal}}/g, availCoal.toFixed(1))
                  .replace(/{{ore}}/g, availOre.toFixed(1))
                  .replace(/{{copper}}/g, availCopper.toFixed(1))
                  .replace(/{{uranium}}/g, availUranium.toFixed(1))
                  .replace(/{{coaldepot}}/g, loadQty.coaldepot)
                  .replace(/{{oredepot}}/g, loadQty.oredepot)
                  .replace(/{{copperdepot}}/g, loadQty.copperdepot)
                  .replace(/{{uraniumdepot}}/g, loadQty.uraniumdepot)
                  .replace(/{{coalsafe}}/g, loadProduct.coal.safe.toFixed(2))
                  .replace(/{{oresafe}}/g, loadProduct.ore.safe.toFixed(2))
                  .replace(
                    /{{coppersafe}}/g,
                    loadProduct.copper.safe.toFixed(2),
                  )
                  .replace(
                    /{{uraniumsafe}}/g,
                    loadProduct.uranium.safe.toFixed(2),
                  ),
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

              $("#planetDetail").append(
                componentFormats.planetShipInfo.replace(
                  /{{planetinfo}}/g,
                  planetInfoStr,
                ),
              );

              for (var [keyinfo, value] of map.entries()) {
                $("#shipDetailInfo").append(
                  componentFormats.detailRow
                    .replace(/{{name}}/g, keyinfo)
                    .replace(/{{using}}/g, value.leave)
                    .replace(/{{total}}/g, value.ttl),
                );
              }

              $("#planetDetail").append(
                componentFormats.planetFleetInfo.replace(
                  /{{planetinfo}}/g,
                  planetInfoStr,
                ),
              );

              let fleetinfo = d.data;
              fleetinfo.sort(function(a, b) {
                if (a.return == null) {
                  if (b.return == null) {
                    return a.arrival - b.arrival;
                  } else {
                    return a.arrival - b.return;
                  }
                } else if (b.return == null) {
                  return a.return - b.arrival;
                } else {
                  return a.return - b.return;
                }
              });

              fleetinfo.forEach(v => {
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
                  if (v.from_planet.id == planetInfo.planet_id) {
                    toInfo = `T> ${v.to_planet.user}, ${v.to_planet.name}(${v.end_x},${v.end_y})`;
                  } else {
                    toInfo = `F< ${v.from_planet.user}, ${v.from_planet.name}(${v.start_x},${v.start_y})`;
                  }
                }

                $("#leaveShipDetailInfo").append(
                  componentFormats.detailFleetRow
                    .replace(/{{type}}/g, v.type)
                    .replace(/{{to}}/g, toInfo)
                    .replace(
                      /{{arrival}}/g,
                      v.arrival != v.return
                        ? new Date(v.arrival * 1000).toLocaleString()
                        : "-",
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
