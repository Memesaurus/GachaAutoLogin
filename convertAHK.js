const { exec } = require("child_process");
const fs = require("fs/promises");
const config = require("./config.json");

const parseDir = async () => {
  const files = await fs.readdir(config.SCRIPTS_PATH);

  if (!files.includes("executables")) {
    await fs.mkdir("./AutoHotKey/executables");
  }

  for (let file of files) {
    if (file != "executables") {
      convertAHKToExe(file);
    }
  }
};

const convertAHKToExe = async (file) => {
  const fileName = file.substr(0, file.length - 4);

  exec(
    `"${config.AHK2EXE_PATH}" /in "${config.SCRIPTS_PATH}/${fileName}.ahk" /out "./executables/${fileName}.exe" /bin "${config.BASE_PATH}"`,
    () => {
      console.log(`Script ${fileName} converted`);
    }
  );
};

parseDir();

module.exports = parseDir;
