const { exec, spawn } = require("child_process");
const installAPKForProcesses = require("./installAPKs");
const config = require("./config.json");
const fs = require("fs/promises");

// downloading data for apps on low performance seems to work (extremely) slow
NOX_INSTANCE_PARAMS =
  process.argv[2] == "install"
    ? [`-resolution:854x480`, `-performance:high`]
    : [`-resolution:854x480`, `-performance:low`];

const executeCommands = async (noxInstances) => {
  const command = process.argv[2];

  if (command === "install") {
    installAPKForProcesses(noxInstances).then(() => console.log("done"));
  } else {
    const apkScripts = (await fs.readdir("./AutoHotKey"))
      .filter((file) => file.startsWith("com."))
      .map((file) => file.substring(0, file.length - 4));
    console.log(apkScripts);
    for (let scriptFile of apkScripts) {
      for (let instance of noxInstances) {
        exec(
          `"${config.NOX_PATH}" -clone:${instance.vmName} "-startPackage:${scriptFile}"`
        );
      }

      await Promise.resolve(
        executeScript(scriptFile, instancesToArgsString(noxInstances))
      ).then((out) => console.log(out));
    }
  }
};

const executeScript = (file, instances) => {
  return new Promise((resolve) => {
    exec(
      `"${config.SCRIPTS_PATH}/executables/${file}.exe" ${instances}}`,
      { timeout: 120000 },
      (error, stdout) => {
        resolve(stdout);
      }
    );
  });
};

const instancesToArgsString = (noxInstances) => {
  return noxInstances
    .map((instance) => instance.windowTitle)
    .map((name) => (name = `"${name}"`))
    .join(" ");
};

const noxInstances = [];

for (let instance = 1; instance < config.MAX_INSTANCES + 1; instance++) {
  const noxInstance = {
    vmName: `Nox_${instance}`,
    windowTitle: `Process_${instance}`,
    instanceProcess: spawn(`${config.NOX_PATH}`, [
      `-clone:Nox_${instance}`,
      `-title:Process_${instance}`,
      ...NOX_INSTANCE_PARAMS,
    ]),
  };

  noxInstances.push(noxInstance);
  console.log(
    `${noxInstance.windowTitle}(pid ${noxInstance.instanceProcess.pid}) created`
  );
}

exec(
  `"${
    config.SCRIPTS_PATH
  }/executables/checkIfNoxIsLoaded" ${instancesToArgsString(noxInstances)}`,
  { timeout: 120000 },
  (error, stdout) => {
    if (stdout.trim() === "loaded") {
      console.log("Processes have been loaded!");
      executeCommands(noxInstances);
    }
  }
);
