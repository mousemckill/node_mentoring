import path from "path";
import { Promise } from "bluebird";
import Umzug from "umzug";

import database from "./database";

const migrationPath: string = path.resolve(__dirname, "migrations");

const umzug = new Umzug({
  storage: "sequelize",
  storageOptions: {
    sequelize: database
  },
  migrations: {
    params: [
      database.getQueryInterface(),
      null,
      function() {
        throw new Error(
          'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
        );
      }
    ],
    path: migrationPath,
    pattern: /\.(j|t)s$/
  },
  logging: function(arg: any) {
    console.log(arg);
  }
});

function logUmzugEvent(eventName: string) {
  return function(name: string, _: any) {
    console.log(`${name} ${eventName}`);
  };
}

umzug.on("migrating", logUmzugEvent("migrating"));
umzug.on("migrated", logUmzugEvent("migrated"));
umzug.on("reverting", logUmzugEvent("reverting"));
umzug.on("reverted", logUmzugEvent("reverted"));

type Result = {
  executed?: any;
  pending?: any;
};

function cmdStatus() {
  let result: Result = {};

  return umzug
    .executed()
    .then(executed => {
      result.executed = executed;
      return umzug.pending();
    })
    .then(pending => {
      result.pending = pending;
      return result;
    })
    .then(({ executed, pending }) => {
      executed = executed.map((m: any) => {
        m.name = path.basename(m.file, path.extname(m.file));
        return m;
      });
      pending = pending.map((m: any) => {
        m.name = path.basename(m.file, path.extname(m.file));
        return m;
      });

      const current =
        executed.length > 0 ? executed[0].file : "<NO_MIGRATIONS>";
      const status = {
        current: current,
        executed: executed.map((m: any) => m.file),
        pending: pending.map((m: any) => m.file)
      };

      console.log(JSON.stringify(status, null, 2));

      return { executed, pending };
    });
}

function cmdMigrate() {
  return umzug.up();
}

function cmdMigrateNext() {
  return cmdStatus().then(({ executed, pending }) => {
    if (pending.length === 0) {
      return Promise.reject(new Error("No pending migrations"));
    }
    const next = pending[0].name;
    return umzug.up({ to: next });
  });
}

function cmdReset() {
  return umzug.down({ to: 0 });
}

function cmdResetPrev() {
  return cmdStatus().then(({ executed, pending }) => {
    if (executed.length === 0) {
      return Promise.reject(new Error("Already at initial state"));
    }
    const prev = executed[executed.length - 1].name;
    return umzug.down({ to: prev });
  });
}

const cmd = process.argv[2].trim();
let executedCmd: any;

console.log(`${cmd.toUpperCase()} BEGIN`);
switch (cmd) {
  case "status":
    executedCmd = cmdStatus();
    break;

  case "up":
  case "migrate":
    executedCmd = cmdMigrate();
    break;

  case "next":
  case "migrate-next":
    executedCmd = cmdMigrateNext();
    break;

  case "down":
  case "reset":
    executedCmd = cmdReset();
    break;

  case "prev":
  case "reset-prev":
    executedCmd = cmdResetPrev();
    break;

  default:
    console.log(`invalid cmd: ${cmd}`);
    process.exit(1);
}

executedCmd
  .then((_result: any) => {
    const doneStr = `${cmd.toUpperCase()} DONE`;
    console.log(doneStr);
    console.log("=".repeat(doneStr.length));
  })
  .then(() => {
    if (cmd !== "status") {
      return cmdStatus();
    }
    return Promise.resolve();
  })
  .then(() => process.exit(0))
  .catch((err: any) => {
    const errorStr = `${cmd.toUpperCase()} ERROR`;
    console.log(errorStr);
    console.log("=".repeat(errorStr.length));
    console.log(err);
    console.log("=".repeat(errorStr.length));
  });
