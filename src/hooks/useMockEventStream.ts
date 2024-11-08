import { sample } from "../util/array";

export function useMockEventStream(args = {}) {
  const { datasets, yDomain } = {
    datasets: new Array(5).fill(0).map((_, i) => `Dataset #${i}`),
    yDomain: 100,
    ...args,
  };

  const meta = {
    kinds: ["asset", "event", "metric", "state", "alert", "enrichment", "pipeline", "finding"],
    categories: ["iam", "network", "authentication"],
    outcomes: [false, true],
    dataset: ["barracuda.spamfirewall", "panw.panos", "azure.auditlogs", "aws.cloudtrail"],
    tags: ["forwarded", "barracuda", "pan-os"],
    types: ["change", "scan", "start", "connection", "group", "info", "allowed", "user"],
  };

  const colors = [
    [10, 182, 255],
    [143, 79, 199],
    [255, 77, 136],
    [255, 153, 20],
    [7, 192, 158],
  ];

  const models: any = datasets.reduce((acc, key) => {
    acc[key] = {
      active: false,
      colors: [sample(colors), sample(colors), sample(colors)],
      events: [],
    };
    return acc;
  }, {} as any);

  function generate(model: string) {
    if (models[model].active === false) return;

    setTimeout(
      () => {
        models[model].events.unshift([new Date(), Math.random() * yDomain]);
        generate(model);
      },
      250 + Math.random() * 100, //* 2 + 2 * Math.sin(window.performance.now() / 40) + 5 * Math.sin(window.performance.now() / 1),
    );
  }

  function start() {
    Object.keys(models).forEach((key) => {
      models[key].active = true;
      generate(key);
    });
  }
  7;
  function stop() {
    Object.keys(models).forEach((key) => {
      models[key].active = false;
    });
  }

  start();

  return {
    start,
    stop,
    models,
  };
}
