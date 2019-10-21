const componentFormats = {
  inputComponent: `
  <div class="row">
    <h3 style="margin-left:2.5%;">Distance Calculator</h3>
    <div class="row" style="border:3px solid #023;border-radius:10px;margin:1% 2.5%;padding:10px;">
      <div class="col-md-1 mb-1">
        <label for="firstName">P1 X</label>
        <input type="text" class="form-control" id="planet1X" placeholder="" value="" required="">
      </div>
      <div class="col-md-1 mb-1">
        <label for="firstName">P1 Y</label>
        <input type="text" class="form-control" id="planet1Y" placeholder="" value="" required="">
      </div>
      <div class="col-md-1 mb-1">
        <label for="firstName">P2 X</label>
        <input type="text" class="form-control" id="planet2X" placeholder="" value="" required="">
      </div>
      <div class="col-md-1 mb-1">
        <label for="firstName">P2 Y</label>
        <input type="text" class="form-control" id="planet2Y" placeholder="" value="" required="">
      </div>
      <div class="col-md-2 mb-2">
        <label for="firstName">Slowest Speed</label>
        <input type="text" class="form-control" id="speed" placeholder="" value="" required="">
      </div>
      <div class="col-md-2 mb-2">
        <label for="firstName">Result</label>
        <input type="text" class="form-control" id="calcResult" placeholder="" value="" required="" readonly>
      </div>
      <div class="col-md-2 mb-2">
        <label for="firstName">Result Time</label>
        <input type="text" class="form-control" id="resultTime" placeholder="" value="" required="" readonly>
      </div>
      <div class="col-md-2 mb-2">
        <button type="submit" id="calcTime" class="btn btn-primary btn-lg btn-block">Calc</button>
      </div>
    </div>
    <div class="col-md-6 mb-3">
      <label for="firstName">Input Account</label>
      <input type="text" class="form-control" id="inputAccount" placeholder="" value="happyberrysboy" required="">
    </div>
    <div class="col-md-6 mb-3">
      <button type="submit" id="loadAccount" class="btn btn-primary btn-lg btn-block">Load</button>
    </div>
    <div id="accountShortcut" style="padding:5px;">
    </div>
  </div>
  `,
  planetComponent: `
  <h3><td>Planet List</td><td></h3>
  <div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Count</th>
          <th scope="col">Name</th>
          <th scope="col">Id</th>
          <th scope="col">X</th>
          <th scope="col">Y</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody id="planetList">

      </tbody>
    </table>
  </div>
  `,
  planetListItem: `
    <tr>
      <td>{{count}}</td>
      <td>{{name}}</td>
      <td>{{id}}</td>
      <td>{{x}}</td>
      <td>{{y}}</td>
      <td><button data-id="{{id}}" class="btn btn-primary btn-sm btn-block planetId">Detail</button></td>
    </tr>
  `,
  planetDetailComponent: `
  <div id="planetDetail"/>
  `,
  planetBasicInfo: `
  <h3>Planet Basic Info</h3>
  <div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Val</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Base</td><td>{{base}}</td></tr>
        <tr><td>Coal</td><td>{{coal}}</td></tr>
        <tr><td>Ore</td><td>{{ore}}</td></tr>
        <tr><td>Copper</td><td>{{copper}}</td></tr>
        <tr><td>Uranium</td><td>{{uranium}}</td></tr>
        <tr><td>CoalDepot</td><td>{{coaldepot}}</td></tr>
        <tr><td>OreDepot</td><td>{{oredepot}}</td></tr>
        <tr><td>CopperDepot</td><td>{{copperdepot}}</td></tr>
        <tr><td>UraniumDepot</td><td>{{uraniumdepot}}</td></tr>
        <tr><td>Shipyard</td><td>{{shipyard}}</td></tr>
        <tr><td>Research</td><td>{{research}}</td></tr>
        <tr><td>Rarity</td><td>{{rarity}}</td></tr>
      </tbody>
    </table>
  </div>
  `,
  planetQtyInfo: `
  <h3>Planet Resource Info</h3>
  <div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Val</th>
          <th scope="col">Depot</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Coal</td><td>{{coal}}</td><td>{{coaldepot}}</td></tr>
        <tr><td>Ore</td><td>{{ore}}</td><td>{{oredepot}}</td></tr>
        <tr><td>Copper</td><td>{{copper}}</td><td>{{copperdepot}}</td></tr>
        <tr><td>Uranium</td><td>{{uranium}}</td><td>{{uraniumdepot}}</td></tr>
      </tbody>
    </table>
  </div>
  `,
  planetShipInfo: `
  <h3>Planet Ships Info</h3>
  <div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Val</th>
        </tr>
      </thead>
      <tbody id="shipDetailInfo">
      </tbody>
    </table>
  </div>
  `,
  detailRow: `<tr><td>{{name}}</td><td>{{val}}</td></tr>`,
  planetFleetInfo: `
  <h3>Planet Fleet Info</h3>
  <div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Type</th>
          <th scope="col">To</th>
          <th scope="col">Arrival</th>
          <th scope="col">Return</th>
          <th scope="col">Ships</th>
        </tr>
      </thead>
      <tbody id="leaveShipDetailInfo">
      </tbody>
    </table>
  </div>
  `,
  detailFleetRow: `
  <tr>
    <td>{{type}}</td>
    <td>{{to}}</td>
    <td>{{arrival}}</td>
    <td>{{return}}</td>
    <td>{{content}}</td>
  </tr>`,
  userShortcut: `<button class="btn btn-primary btn-sm btn-block shortcut">{{account}}</button>`,
};
