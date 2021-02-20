const xlsx = require("xlsx");

const orderWB = xlsx.readFile("./worksheet/teamroot.xls");

const orderWS = orderWB.Sheets["Shortage"];

const orderDataXL = xlsx.utils.sheet_to_json(orderWS);

const mappedOrderData = orderDataXL.map((s) => {
  const SKU = s.SKU;
  const Description = s.Description;
  const Weeks2 = s["Need 0-6"] + s["Need 7-13"];
  const Weeks4 =
    s["Need 0-6"] + s["Need 7-13"] + s["Need 14-20 "] + s["Need 21-27"];
  const IOQty = s["Inbound Orders"];
  const Cat = s.Cat;
  const totalNeeded = s["Total Needed"];
  return {
    SKU,
    Description,
    Weeks2,
    Weeks4,
    IOQty,
    Cat,
    totalNeeded,
  };
});

module.exports = mappedOrderData;
