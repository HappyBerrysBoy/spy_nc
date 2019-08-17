const componentFormats = {
  inputComponent: `
  <div class="row">
    <div class="col-md-6 mb-3">
      <label for="firstName">Input Account</label>
      <input type="text" class="form-control" id="inputAccount" placeholder="" value="happyberrysboy" required="">
    </div>
    <div class="col-md-6 mb-3">
      <button type="submit" id="loadAccount" class="btn btn-primary btn-lg btn-block">Load</button>
    </div>
  </div>
  `,
  planetComponent: `
  Planet List
  <div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Id</th>
          <th scope="col">X</th>
          <th scope="col">Y</th>
          <th scope="col">Starter</th>
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
      <td>{{name}}</td>
      <td>{{id}}</td>
      <td>{{x}}</td>
      <td>{{y}}</td>
      <td>{{starter}}</td>
      <td><button data-id="{{id}}" class="btn btn-primary btn-sm btn-block planetId">Detail</button></td>
    </tr>
  `,
  planetDetailComponent: `
  <div id="planetDetail"/>
  `,
  planetBasicInfo: `
  Planet Basic Info
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
  Planet Resource Info
  <div>
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Val</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Coal</td><td>{{coal}}</td></tr>
        <tr><td>Ore</td><td>{{ore}}</td></tr>
        <tr><td>Copper</td><td>{{copper}}</td></tr>
        <tr><td>Uranium</td><td>{{uranium}}</td></tr>
        <tr><td>CoalDepot</td><td>{{coaldepot}}</td></tr>
        <tr><td>OreDepot</td><td>{{oredepot}}</td></tr>
        <tr><td>CopperDepot</td><td>{{copperdepot}}</td></tr>
        <tr><td>UraniumDepot</td><td>{{uraniumdepot}}</td></tr>
      </tbody>
    </table>
  </div>
  `,
  planetFleetInfo: `
  Planet Ships Info
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
  detailRow: `<tr><td>{{name}}</td><td>{{val}}</td></tr>`
};
