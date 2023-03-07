const path = require("path");
const fs = require("fs/promises");
const { exec } = require("child_process");
const config = require("./config.json");
const { setTimeout } = require("timers/promises");

module.exports = installAPKForProcesses = async (noxInstances) => {
  const apks = await (
    await fs.readdir("./APKs")
  ).filter((file) => file.endsWith(".apk"));

  for (let apk of apks) {
    installAPKs(apk, noxInstances);
    // Nox process seems to only accept the last command if they are executed in succession
    await setTimeout(5000);
  }
};

const installAPKs = async (apk, noxInstances) => {
  const APKPath = path.resolve("./APKs");
  for (instance of noxInstances) {
    const cloneId = instance.vmName;
    exec(`"${config.NOX_PATH}" -clone:${cloneId} "-apk:${APKPath}/${apk}"`);
    console.log(`Queued installation of ${apk} for ${cloneId}`);
  }
};
