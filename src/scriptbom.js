const xlsx = require("xlsx");

const bomWB = xlsx.readFile("./worksheet/bom.xls");

const bomWS = bomWB.Sheets["bom"];

const bomDataXL = xlsx.utils.sheet_to_json(bomWS);

let bomArr = [];

let bomObj = {};
bomObj.comps = [];
for (let i = 0; i < bomDataXL.length; i++) {
  if (!bomDataXL[i].hasOwnProperty("sku")) {
    bomObj.comps.push(bomDataXL[i]);
  } else {
    bomObj.sku = bomDataXL[i].sku;
    bomObj.skuComponent = bomDataXL[i].component;
    bomObj.skuComponentQty = bomDataXL[i].component_qty;
    bomArr.push(bomObj);
    bomObj = {};
    bomObj.comps = [];
  }
}

module.exports = bomArr;
