import { useState, useEffect, useCallback, useRef } from "react";

interface PLCSimulationProps {
  moduleIndex: number;
}

/* ── Module 0: PLC Fundamentals ── */
const FundamentalsSim = () => {
  const [powerOn, setPowerOn] = useState(false);
  const [inputs, setInputs] = useState([false, false, false, false]);
  const [scanCycle, setScanCycle] = useState(0);

  useEffect(() => {
    if (!powerOn) return;
    const interval = setInterval(() => setScanCycle(s => s + 1), 100);
    return () => clearInterval(interval);
  }, [powerOn]);

  const outputs = inputs.map((inp) => powerOn && inp);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Explore PLC I/O modules and scan cycle execution.</p>
      <div className="bg-[#1e1e2e] rounded-sm p-6 space-y-4">
        <div className="border border-[#444] rounded p-3 bg-[#2a2a3a]">
          <div className="text-[10px] font-medium text-[#aaa] mb-2">PLC Block Diagram</div>
          <div className="font-mono text-[10px] text-[#888] space-y-0.5">
            <div>┌─────────┬───────┬────────────────┐</div>
            <div>│  POWER  │  CPU  │  I/O MODULES   │</div>
            <div>├─────────┼───────┼────────────────┤</div>
            <div>│  {powerOn ? "✓ ON " : "✗ OFF"}  │ {String(scanCycle).padStart(4, '0')}  │ IN:{inputs.filter(Boolean).length} OUT:{outputs.filter(Boolean).length}        │</div>
            <div>└─────────┴───────┴────────────────┘</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPowerOn(true)} disabled={powerOn} className="px-4 py-2 text-xs font-bold rounded-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition-colors">Power ON</button>
          <button onClick={() => { setPowerOn(false); setScanCycle(0); }} disabled={!powerOn} className="px-4 py-2 text-xs font-bold rounded-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition-colors">Power OFF</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {inputs.map((inp, i) => (
            <button key={i} onClick={() => setInputs(prev => prev.map((v, j) => j === i ? !v : v))} className={`p-2 rounded-sm text-center text-[10px] font-bold border transition-all ${inp ? "bg-green-900/30 border-green-600 text-green-400" : "bg-[#2a2a3a] border-[#444] text-[#888]"}`}>
              I0.{i}: {inp ? "ON" : "OFF"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {outputs.map((out, i) => (
            <div key={i} className={`p-2 rounded-sm text-center text-[10px] font-bold border ${out ? "bg-blue-900/30 border-blue-600 text-blue-400" : "bg-[#2a2a3a] border-[#444] text-[#666]"}`}>
              Q0.{i}: {out ? "ON" : "OFF"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Module 1: Programming Basics – Start/Stop with TON ── */
const MotorTimerSim = () => {
  const [i00, setI00] = useState(false);
  const [i01, setI01] = useState(false);
  const [motorOn, setMotorOn] = useState(false);
  const [timerPV, setTimerPV] = useState(0);
  const [timerDone, setTimerDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TIMER_SV = 1.0;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerPV(0);
    setTimerDone(false);
    timerRef.current = setInterval(() => {
      setTimerPV(prev => {
        const next = Math.round((prev + 0.01) * 100) / 100;
        if (next >= TIMER_SV) {
          setTimerDone(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return TIMER_SV;
        }
        return next;
      });
    }, 10);
  }, []);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerPV(0); setTimerDone(false); setMotorOn(false); setI00(false); setI01(false);
  };

  useEffect(() => {
    if (i00 && !i01) startTimer();
    if (i01) { if (timerRef.current) clearInterval(timerRef.current); setTimerPV(0); setTimerDone(false); setMotorOn(false); }
  }, [i00, i01, startTimer]);

  useEffect(() => { if (timerDone && !i01) setMotorOn(true); }, [timerDone, i01]);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Start and stop the motor using the timer-controlled delay:</p>
      {/* Ladder Diagram */}
      <div className="border border-[#444] rounded p-4 bg-[#2a2a3a]">
        <div className="text-[10px] font-medium text-[#aaa] mb-2">Ladder Logic Diagram</div>
        <svg viewBox="0 0 600 100" className="w-full h-auto" style={{ maxHeight: 100 }}>
          <line x1="30" y1="10" x2="30" y2="90" stroke="#4a7" strokeWidth="3" />
          <line x1="570" y1="10" x2="570" y2="90" stroke="#4a7" strokeWidth="3" />
          <line x1="30" y1="40" x2="100" y2="40" stroke="#888" strokeWidth="1.5" />
          <line x1="100" y1="30" x2="100" y2="50" stroke={i00 ? "#4a7" : "#888"} strokeWidth="2" />
          <line x1="130" y1="30" x2="130" y2="50" stroke={i00 ? "#4a7" : "#888"} strokeWidth="2" />
          <text x="105" y="22" fontSize="9" fill="#aaa">I0.0</text>
          <line x1="130" y1="40" x2="180" y2="40" stroke="#888" strokeWidth="1.5" />
          <line x1="180" y1="30" x2="180" y2="50" stroke={!i01 ? "#4a7" : "#888"} strokeWidth="2" />
          <line x1="210" y1="30" x2="210" y2="50" stroke={!i01 ? "#4a7" : "#888"} strokeWidth="2" />
          <line x1="180" y1="30" x2="210" y2="50" stroke={!i01 ? "#4a7" : "#888"} strokeWidth="1.5" />
          <text x="185" y="22" fontSize="9" fill="#aaa">I0.1</text>
          <line x1="210" y1="40" x2="280" y2="40" stroke="#888" strokeWidth="1.5" />
          <rect x="280" y="22" width="120" height="40" rx="3" fill={timerDone ? "#2a5a3a" : "#2a2a3a"} stroke={timerDone ? "#4a7" : "#555"} strokeWidth="1.5" />
          <text x="305" y="38" fontSize="10" fill="#4a7" fontWeight="bold">TON</text>
          <text x="305" y="50" fontSize="8" fill="#aaa">T40 1s</text>
          <text x="290" y="58" fontSize="7" fill="#888">PV:{timerPV.toFixed(2)}/SV:{TIMER_SV.toFixed(2)}</text>
          <line x1="400" y1="40" x2="520" y2="40" stroke="#888" strokeWidth="1.5" />
          <circle cx="535" cy="40" r="10" fill="none" stroke={motorOn ? "#4a7" : "#888"} strokeWidth="2" />
          <text x="528" y="44" fontSize="8" fill={motorOn ? "#4a7" : "#888"}>Q1</text>
          <line x1="545" y1="40" x2="570" y2="40" stroke="#888" strokeWidth="1.5" />
          <text x="548" y="22" fontSize="8" fill="#ccc">Motor</text>
        </svg>
      </div>
      {/* Controls */}
      <div className="bg-[#1e1e2e] rounded-sm p-5">
        <div className="text-[10px] font-medium text-[#aaa] mb-3">PLC Timer Simulation</div>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <button onClick={() => { setI00(true); setI01(false); }} className="px-4 py-2 text-xs font-bold rounded-sm bg-green-600 text-white hover:bg-green-700 transition-colors">Start</button>
          <button onClick={() => { setI01(true); setI00(false); }} className="px-4 py-2 text-xs font-bold rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors">Stop</button>
          <button onClick={resetTimer} className="px-4 py-2 text-xs font-bold rounded-sm bg-[#444] text-[#ccc] hover:bg-[#555] transition-colors">Reset Timer</button>
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${motorOn ? "border-green-500" : "border-[#555]"}`}>
              <span className={motorOn ? "animate-spin" : ""} style={motorOn ? { animationDuration: "1s" } : {}}>⚙️</span>
            </div>
            <div><div className="text-[10px] text-[#ccc]">Motor</div><div className={`text-xs font-bold ${motorOn ? "text-green-400" : "text-[#666]"}`}>{motorOn ? "ON" : "OFF"}</div></div>
          </div>
        </div>
        <div className="bg-[#0a0a0a] rounded p-3 inline-block border border-[#333]">
          <div className="font-mono text-2xl text-green-400" style={{ letterSpacing: 2 }}>{timerPV.toFixed(2)}<span className="text-sm text-green-600">s</span></div>
        </div>
      </div>
    </div>
  );
};

/* ── Module 2: Timer & Counter ── */
const TimerCounterSim = () => {
  const [i00, setI00] = useState(false);
  const [timerPV, setTimerPV] = useState(0);
  const [timerDone, setTimerDone] = useState(false);
  const [counterValue, setCounterValue] = useState(0);
  const [counterDone, setCounterDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TIMER_SV = 2.0;
  const COUNTER_SV = 5;

  useEffect(() => {
    if (i00 && !timerDone) {
      timerRef.current = setInterval(() => {
        setTimerPV(prev => {
          const next = Math.round((prev + 0.01) * 100) / 100;
          if (next >= TIMER_SV) { setTimerDone(true); if (timerRef.current) clearInterval(timerRef.current); return TIMER_SV; }
          return next;
        });
      }, 10);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [i00, timerDone]);

  const handleCount = () => { if (counterValue < COUNTER_SV) { const next = counterValue + 1; setCounterValue(next); if (next >= COUNTER_SV) setCounterDone(true); } };
  const resetAll = () => { if (timerRef.current) clearInterval(timerRef.current); setI00(false); setTimerPV(0); setTimerDone(false); setCounterValue(0); setCounterDone(false); };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Timer (TON) and Counter (CTU) block simulation.</p>
      <div className="border border-[#444] rounded p-3 bg-[#2a2a3a]">
        <div className="text-[10px] font-medium text-[#aaa] mb-2">Ladder Logic</div>
        <div className="font-mono text-[10px] text-[#888] space-y-0.5">
          <div>|---[ I0.0 ]---[TON T40 2s]---( Q0.0 )---|</div>
          <div>|---[ I0.0 ]---[CTU C5 PV:{counterValue}]---( Q0.1 )---|</div>
        </div>
      </div>
      <div className="bg-[#1e1e2e] rounded-sm p-5 space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setI00(true)} disabled={i00} className="px-4 py-2 text-xs font-bold rounded-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition-colors">Start (I0.0)</button>
          <button onClick={handleCount} className="px-4 py-2 text-xs font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">Count Pulse</button>
          <button onClick={resetAll} className="px-4 py-2 text-xs font-bold rounded-sm bg-[#444] text-[#ccc] hover:bg-[#555] transition-colors">Reset All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 border rounded-sm ${timerDone ? "border-green-600 bg-green-900/20" : "border-[#444]"}`}>
            <div className="text-[10px] text-[#aaa]">TON Timer (2s)</div>
            <div className="font-mono text-xl text-green-400">{timerPV.toFixed(2)}s</div>
            <div className={`text-[10px] font-bold mt-1 ${timerDone ? "text-green-400" : "text-[#666]"}`}>Q0.0: {timerDone ? "ON" : "OFF"}</div>
          </div>
          <div className={`p-3 border rounded-sm ${counterDone ? "border-blue-600 bg-blue-900/20" : "border-[#444]"}`}>
            <div className="text-[10px] text-[#aaa]">CTU Counter (SV: {COUNTER_SV})</div>
            <div className="font-mono text-xl text-blue-400">{counterValue} / {COUNTER_SV}</div>
            <div className={`text-[10px] font-bold mt-1 ${counterDone ? "text-blue-400" : "text-[#666]"}`}>Q0.1: {counterDone ? "ON" : "OFF"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Module 3: Industrial Applications ── */
const IndustrialAppSim = () => {
  const [conveyorOn, setConveyorOn] = useState(false);
  const [sensorTriggered, setSensorTriggered] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [stamperActive, setStamperActive] = useState(false);

  useEffect(() => {
    if (conveyorOn && sensorTriggered) {
      setStamperActive(true);
      setItemCount(c => c + 1);
      const timeout = setTimeout(() => { setStamperActive(false); setSensorTriggered(false); }, 800);
      return () => clearTimeout(timeout);
    }
  }, [conveyorOn, sensorTriggered]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Industrial conveyor with proximity sensor and stamper.</p>
      <div className="border border-[#444] rounded p-3 bg-[#2a2a3a]">
        <div className="font-mono text-[10px] text-[#888] space-y-0.5">
          <div>|---[ START ]---+---( Conveyor )---|</div>
          <div>|---[ Sensor ]--[TON]--( Stamp )---|</div>
        </div>
      </div>
      <div className="bg-[#1e1e2e] rounded-sm p-5 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setConveyorOn(true)} disabled={conveyorOn} className="px-4 py-2 text-xs font-bold rounded-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition-colors">Start Conveyor</button>
          <button onClick={() => { setConveyorOn(false); setSensorTriggered(false); setStamperActive(false); }} disabled={!conveyorOn} className="px-4 py-2 text-xs font-bold rounded-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition-colors">Stop</button>
          <button onClick={() => setSensorTriggered(true)} disabled={!conveyorOn || sensorTriggered} className="px-4 py-2 text-xs font-bold rounded-sm bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-40 transition-colors">Trigger Sensor</button>
          <button onClick={() => setItemCount(0)} className="px-4 py-2 text-xs font-bold rounded-sm bg-[#444] text-[#ccc] hover:bg-[#555] transition-colors">Reset Counter</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-3 border rounded-sm text-center ${conveyorOn ? "border-green-600 bg-green-900/20" : "border-[#444]"}`}><div className="text-[10px] text-[#aaa]">Conveyor</div><div className={`text-xs font-bold ${conveyorOn ? "text-green-400" : "text-[#666]"}`}>{conveyorOn ? "RUNNING" : "STOPPED"}</div></div>
          <div className={`p-3 border rounded-sm text-center ${stamperActive ? "border-yellow-600 bg-yellow-900/20" : "border-[#444]"}`}><div className="text-[10px] text-[#aaa]">Stamper</div><div className={`text-xs font-bold ${stamperActive ? "text-yellow-400" : "text-[#666]"}`}>{stamperActive ? "STAMPING" : "IDLE"}</div></div>
          <div className="p-3 border border-[#444] rounded-sm text-center"><div className="text-[10px] text-[#aaa]">Items</div><div className="font-mono text-xl text-blue-400">{itemCount}</div></div>
        </div>
      </div>
    </div>
  );
};

const simComponents = [FundamentalsSim, MotorTimerSim, TimerCounterSim, IndustrialAppSim];

const PLCSimulation = ({ moduleIndex }: PLCSimulationProps) => {
  const Sim = simComponents[moduleIndex] || FundamentalsSim;
  return (
    <div className="mt-4 border-t border-dashed border-border pt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-4 w-1 bg-primary rounded-full" />
        <h4 className="text-sm font-bold text-foreground">PLC Timer Simulation</h4>
      </div>
      <Sim />
    </div>
  );
};

export default PLCSimulation;
