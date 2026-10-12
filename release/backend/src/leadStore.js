// Where validated leads are stored.
//
// DATABASE NOT CONNECTED YET: the developer connects the database here.
// saveLead() receives one validated lead (fields listed in database/README.md)
// and must resolve when it is saved, or throw if saving fails (the visitor then sees an error).
// Until then, leads are only written to the server log.

async function saveLead(lead) {
  console.log("New lead (database not connected yet):", JSON.stringify(lead));
}

module.exports = { saveLead };
