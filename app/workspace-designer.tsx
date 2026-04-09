'use client';

import { useMemo, useState } from 'react';

type Desk = {
  id: string;
  name: string;
  price: number;
  surface: string;
};

type Chair = {
  id: string;
  name: string;
  price: number;
  seat: string;
};

type Accessory = {
  id: string;
  name: string;
  price: number;
  kind: 'monitor' | 'lamp' | 'plant' | 'notebook' | 'speaker';
};

type BuilderState = {
  deskId: string;
  chairId: string;
  accessoryCounts: Record<string, number>;
};

const desks: Desk[] = [
  {
    id: 'desk-oak',
    name: 'Nomad Oak Desk',
    price: 89,
    surface: 'linear-gradient(120deg, #9e704f 0%, #7b4f2f 100%)',
  },
  {
    id: 'desk-white',
    name: 'Cloud White Desk',
    price: 99,
    surface: 'linear-gradient(120deg, #f4f7fb 0%, #c7ccd7 100%)',
  },
  {
    id: 'desk-carbon',
    name: 'Carbon Pro Desk',
    price: 119,
    surface: 'linear-gradient(120deg, #5c6270 0%, #313641 100%)',
  },
];

const chairs: Chair[] = [
  {
    id: 'chair-breeze',
    name: 'Breeze Mesh Chair',
    price: 55,
    seat: 'linear-gradient(120deg, #495464 0%, #242d3b 100%)',
  },
  {
    id: 'chair-sand',
    name: 'Sand Comfort Chair',
    price: 49,
    seat: 'linear-gradient(120deg, #dac8a6 0%, #bda47f 100%)',
  },
  {
    id: 'chair-ruby',
    name: 'Ruby Focus Chair',
    price: 62,
    seat: 'linear-gradient(120deg, #c34c5d 0%, #7f2432 100%)',
  },
];

const accessories: Accessory[] = [
  { id: 'acc-monitor', name: '4K Monitor', price: 25, kind: 'monitor' },
  { id: 'acc-lamp', name: 'Desk Lamp', price: 9, kind: 'lamp' },
  { id: 'acc-plant', name: 'Mini Plant', price: 7, kind: 'plant' },
  { id: 'acc-notebook', name: 'Notebook Stand', price: 11, kind: 'notebook' },
  { id: 'acc-speaker', name: 'Bluetooth Speaker', price: 13, kind: 'speaker' },
];

const accessoryLimits: Partial<Record<Accessory['kind'], number>> = {
  monitor: 3,
  lamp: 2,
  plant: 2,
};

const presets: Array<{ id: string; label: string; state: BuilderState }> = [
  {
    id: 'preset-minimal',
    label: 'Minimal Set',
    state: {
      deskId: 'desk-white',
      chairId: 'chair-breeze',
      accessoryCounts: {
        'acc-monitor': 1,
        'acc-lamp': 1,
        'acc-plant': 0,
        'acc-notebook': 1,
        'acc-speaker': 0,
      },
    },
  },
  {
    id: 'preset-dev',
    label: 'Developer Pro',
    state: {
      deskId: 'desk-carbon',
      chairId: 'chair-ruby',
      accessoryCounts: {
        'acc-monitor': 2,
        'acc-lamp': 1,
        'acc-plant': 1,
        'acc-notebook': 1,
        'acc-speaker': 1,
      },
    },
  },
  {
    id: 'preset-relaxed',
    label: 'Calm Creator',
    state: {
      deskId: 'desk-oak',
      chairId: 'chair-sand',
      accessoryCounts: {
        'acc-monitor': 1,
        'acc-lamp': 1,
        'acc-plant': 2,
        'acc-notebook': 0,
        'acc-speaker': 1,
      },
    },
  },
];

const defaultCounts = Object.fromEntries(accessories.map((item) => [item.id, 0]));

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function SceneAccessory({ kind, index }: { kind: Accessory['kind']; index: number }) {
  const positions: Record<Accessory['kind'], Array<{ top: string; left: string }>> = {
    monitor: [
      { top: '18%', left: '26%' },
      { top: '17%', left: '44%' },
      { top: '18%', left: '62%' },
    ],
    lamp: [
      { top: '20%', left: '78%' },
      { top: '22%', left: '12%' },
    ],
    plant: [
      { top: '58%', left: '13%' },
      { top: '58%', left: '76%' },
    ],
    notebook: [{ top: '47%', left: '56%' }],
    speaker: [{ top: '49%', left: '34%' }],
  };

  const icon: Record<Accessory['kind'], string> = {
    monitor: 'M',
    lamp: 'L',
    plant: 'P',
    notebook: 'N',
    speaker: 'S',
  };

  const picked = positions[kind][index % positions[kind].length];

  return (
    <div
      className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-slate-900/85 text-center text-base text-white shadow-lg"
      style={{ top: picked.top, left: picked.left }}
      aria-hidden="true"
    >
      {icon[kind]}
    </div>
  );
}

export default function WorkspaceDesigner() {
  const [deskId, setDeskId] = useState(desks[0].id);
  const [chairId, setChairId] = useState(chairs[0].id);
  const [accessoryCounts, setAccessoryCounts] = useState<Record<string, number>>({ ...defaultCounts });

  const selectedDesk = useMemo(() => desks.find((item) => item.id === deskId) ?? desks[0], [deskId]);
  const selectedChair = useMemo(
    () => chairs.find((item) => item.id === chairId) ?? chairs[0],
    [chairId],
  );

  const selectedAccessories = useMemo(
    () =>
      accessories
        .map((item) => ({ ...item, count: accessoryCounts[item.id] ?? 0 }))
        .filter((item) => item.count > 0),
    [accessoryCounts],
  );

  const subtotal = useMemo(() => {
    const accessoriesTotal = selectedAccessories.reduce((total, item) => total + item.price * item.count, 0);
    return selectedDesk.price + selectedChair.price + accessoriesTotal;
  }, [selectedDesk.price, selectedChair.price, selectedAccessories]);

  const onAccessoryChange = (id: string, next: number, kind: Accessory['kind']) => {
    const limit = accessoryLimits[kind];
    const safeValue = Math.max(0, limit ? Math.min(next, limit) : next);
    setAccessoryCounts((current) => ({ ...current, [id]: safeValue }));
  };

  const applyPreset = (state: BuilderState) => {
    setDeskId(state.deskId);
    setChairId(state.chairId);
    setAccessoryCounts({ ...defaultCounts, ...state.accessoryCounts });
  };

  const resetAll = () => {
    setDeskId(desks[0].id);
    setChairId(chairs[0].id);
    setAccessoryCounts({ ...defaultCounts });
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(244,242,236,0.92)_40%,_rgba(226,233,241,0.9)_100%)] p-6 shadow-[0_24px_60px_-26px_rgba(18,32,52,0.45)] sm:p-8">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-300/25 blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-amber-300/25 blur-2xl" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Monis.rent Designer</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Build your Bali workspace in minutes.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-700 sm:text-base">
          Pick a desk, choose a chair, add accessories, and preview your setup live before you rent.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-900 hover:text-slate-950"
              onClick={() => applyPreset(preset.state)}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            className="rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            onClick={resetAll}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Live Workspace Preview</h2>
              <p className="text-sm text-slate-600">Real-time visual update</p>
            </div>

            <div className="relative min-h-[310px] overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,_#f7f6f3_0%,_#dde4ea_72%,_#ccd4de_100%)] p-4 sm:min-h-[360px]">
              <div className="absolute inset-x-4 bottom-4 h-[4.5rem] rounded-xl bg-[linear-gradient(90deg,_#ced7e2_0%,_#b9c5d6_100%)]" />

              <div
                className="absolute left-1/2 top-[54%] h-20 w-[84%] -translate-x-1/2 rounded-xl border border-black/10 shadow-lg"
                style={{ background: selectedDesk.surface }}
                aria-label={`Selected desk ${selectedDesk.name}`}
              />

              <div
                className="absolute left-1/2 top-[68%] h-16 w-36 -translate-x-1/2 rounded-t-[1.5rem] border border-black/10 shadow-md"
                style={{ background: selectedChair.seat }}
                aria-label={`Selected chair ${selectedChair.name}`}
              />

              {selectedAccessories.flatMap((item) =>
                Array.from({ length: item.count }).map((_, idx) => (
                  <SceneAccessory key={`${item.id}-${idx}`} kind={item.kind} index={idx} />
                )),
              )}

              <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700">
                {selectedDesk.name}
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700">
                {selectedChair.name}
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Choose your furniture</h2>

            <div className="mt-4 space-y-5">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Desk</h3>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {desks.map((desk) => (
                    <button
                      key={desk.id}
                      type="button"
                      onClick={() => setDeskId(desk.id)}
                      className={cx(
                        'rounded-xl border p-3 text-left transition',
                        deskId === desk.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-slate-700',
                      )}
                    >
                      <p className="text-sm font-semibold">{desk.name}</p>
                      <p className={cx('mt-1 text-xs', deskId === desk.id ? 'text-slate-200' : 'text-slate-500')}>
                        {formatPrice(desk.price)} / month
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Chair</h3>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {chairs.map((chair) => (
                    <button
                      key={chair.id}
                      type="button"
                      onClick={() => setChairId(chair.id)}
                      className={cx(
                        'rounded-xl border p-3 text-left transition',
                        chairId === chair.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-slate-700',
                      )}
                    >
                      <p className="text-sm font-semibold">{chair.name}</p>
                      <p className={cx('mt-1 text-xs', chairId === chair.id ? 'text-slate-200' : 'text-slate-500')}>
                        {formatPrice(chair.price)} / month
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Add accessories</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {accessories.map((item) => {
                const count = accessoryCounts[item.id] ?? 0;
                const limit = accessoryLimits[item.kind];
                const disabledPlus = limit ? count >= limit : false;
                return (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{formatPrice(item.price)} / month each</p>
                        {limit ? <p className="mt-1 text-xs text-slate-400">max {limit}</p> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-md border border-slate-300 text-lg text-slate-700 transition hover:border-slate-900"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => onAccessoryChange(item.id, count - 1, item.kind)}
                          disabled={count === 0}
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-sm font-semibold text-slate-900">{count}</span>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-md border border-slate-300 text-lg text-slate-700 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Add ${item.name}`}
                          onClick={() => onAccessoryChange(item.id, count + 1, item.kind)}
                          disabled={disabledPlus}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-6">
          <h2 className="text-lg font-semibold text-slate-900">Summary / Checkout</h2>
          <p className="mt-1 text-sm text-slate-500">Monthly rental estimate</p>

          <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Desk</span>
              <span className="font-medium text-slate-900">{formatPrice(selectedDesk.price)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Chair</span>
              <span className="font-medium text-slate-900">{formatPrice(selectedChair.price)}</span>
            </div>
            {selectedAccessories.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  {item.name} x{item.count}
                </span>
                <span className="font-medium text-slate-900">{formatPrice(item.price * item.count)}</span>
              </div>
            ))}
            {selectedAccessories.length === 0 ? (
              <p className="text-sm text-slate-500">No accessories selected yet.</p>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <span className="text-sm text-slate-600">Total per month</span>
            <strong className="text-xl text-slate-950">{formatPrice(subtotal)}</strong>
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Rent This Setup
          </button>

          <p className="mt-3 text-xs text-slate-500">
            Delivery in Bali in 1-3 working days. Final price may vary based on rental period.
          </p>
        </aside>
      </section>
    </main>
  );
}
