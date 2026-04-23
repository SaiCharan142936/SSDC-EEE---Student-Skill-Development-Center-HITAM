import { useState, useEffect, useRef, useCallback } from "react";

interface PythonCompilerProps {
  moduleIndex: number;
}

const MODULE_CODE: Record<number, { title: string; code: string; inputPrompt?: string }> = {
  0: {
    title: "Python Fundamentals & Operators",
    code: `# Python Fundamentals - Arithmetic Operators
a = 15
b = 4

print("Arithmetic Operators:")
print(f"  a + b = {a + b}")
print(f"  a - b = {a - b}")
print(f"  a * b = {a * b}")
print(f"  a / b = {a / b:.2f}")
print(f"  a // b = {a // b}")
print(f"  a % b = {a % b}")
print(f"  a ** b = {a ** b}")

print("\\nComparison Operators:")
print(f"  a > b: {a > b}")
print(f"  a == b: {a == b}")

print("\\nLogical Operators:")
print(f"  a > 10 and b < 5: {a > 10 and b < 5}")`,
  },
  1: {
    title: "Flow Control",
    inputPrompt: "Enter number:",
    code: `num = int(input("Enter a number: "))

if num % 2 == 0:
    print(num, "is even")
else:
    print(num, "is odd")

factorial = 1
for i in range(1, num + 1):
    factorial *= i

print("Factorial:", factorial)`,
  },
  2: {
    title: "Data Structures",
    code: `# List operations
fruits = ["apple", "banana", "cherry", "date"]
print("List:", fruits)
fruits.append("elderberry")
print("After append:", fruits)
fruits.sort()
print("Sorted:", fruits)

# Tuple
coords = (10, 20, 30)
print("\\nTuple:", coords)
print("Length:", len(coords))

# Set
numbers = {1, 2, 3, 4, 5, 3, 2, 1}
print("\\nSet (unique):", numbers)

# Dictionary
student = {"name": "Ashish", "age": 21, "branch": "EEE"}
print("\\nDictionary:", student)
print("Keys:", list(student.keys()))`,
  },
  3: {
    title: "Functions & File Handling",
    code: `# User Defined Function
def fibonacci(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print("Fibonacci(10):", fibonacci(10))

# Exception Handling
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error caught: {e}")

# Pattern Program
print("\\nPattern:")
for i in range(1, 6):
    print("* " * i)`,
  },
};

const PythonCompiler = ({ moduleIndex }: PythonCompilerProps) => {
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(MODULE_CODE[moduleIndex]?.code || MODULE_CODE[0].code);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [userInput, setUserInput] = useState("7");
  const [error, setError] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const moduleInfo = MODULE_CODE[moduleIndex] || MODULE_CODE[0];

  useEffect(() => {
    setCode(moduleInfo.code);
    setOutput("");
    setError("");
  }, [moduleIndex, moduleInfo.code]);

  const loadPyodide = useCallback(async () => {
    if (pyodideInstance) return pyodideInstance;
    setLoading(true);
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error("Failed to load Pyodide")); });
      }
      const py = await (window as any).loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/" });
      setPyodideInstance(py);
      setLoading(false);
      return py;
    } catch {
      setLoading(false);
      setError("Failed to load Python runtime. Please try again.");
      return null;
    }
  }, [pyodideInstance]);

  const runCode = async () => {
    setRunning(true);
    setOutput("");
    setError("");

    try {
      const py = await loadPyodide();
      if (!py) { setRunning(false); return; }

      py.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

      if (moduleInfo.inputPrompt && userInput) {
        py.runPython(`
_input_queue = ${JSON.stringify([userInput])}
_input_idx = 0
def _mock_input(prompt=""):
    global _input_idx
    sys.stdout.write(str(prompt))
    if _input_idx < len(_input_queue):
        val = _input_queue[_input_idx]
        _input_idx += 1
        sys.stdout.write(str(val) + "\\n")
        return val
    return ""
input = _mock_input
`);
      }

      try { py.runPython(code); } catch (pyErr: any) {
        const stderr = py.runPython("sys.stderr.getvalue()");
        setError(stderr || pyErr.message || String(pyErr));
      }

      const capturedOutput = py.runPython("sys.stdout.getvalue()");
      setOutput(capturedOutput);
      py.runPython("sys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }

    setRunning(false);
  };

  useEffect(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }, [output, error]);

  return (
    <div className="mt-4 border-t border-dashed border-border pt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-4 w-1 bg-primary rounded-full" />
        <h4 className="text-sm font-bold text-foreground">Run Python Code Online</h4>
      </div>

      {moduleInfo.inputPrompt && (
        <div className="flex items-center gap-3 mb-3 border rounded-sm p-3 bg-background">
          <label className="text-xs font-medium text-foreground whitespace-nowrap">{moduleInfo.inputPrompt}</label>
          <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border rounded-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <button onClick={runCode} disabled={running || loading} className="px-5 py-1.5 text-xs font-bold rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {loading ? "Loading..." : running ? "Running..." : "Run Code"}
          </button>
        </div>
      )}

      <div className="bg-[#1e1e2e] rounded-t-sm border border-[#333] overflow-hidden">
        <div className="flex">
          <div className="bg-[#2a2a3a] text-[#666] text-right py-3 px-2 select-none border-r border-[#333]" style={{ minWidth: 36 }}>
            {code.split("\n").map((_, i) => (<div key={i} className="text-[11px] leading-5 font-mono">{i + 1}</div>))}
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} className="flex-1 bg-transparent text-[#d4d4d4] font-mono text-[12px] leading-5 p-3 resize-none focus:outline-none min-h-[200px]" style={{ tabSize: 4 }} />
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <button onClick={runCode} disabled={running || loading} className="px-5 py-2 text-xs font-bold rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {loading ? "Loading Python..." : running ? "Running..." : "Run Code"}
        </button>
        <button onClick={() => { setOutput(""); setError(""); }} className="px-4 py-2 text-xs font-medium rounded-sm border text-muted-foreground hover:bg-secondary transition-colors">
          Clear Output
        </button>
      </div>

      {(output || error) && (
        <div ref={outputRef} className="bg-[#0a0a0a] border border-[#333] rounded-b-sm p-4 font-mono text-[12px] leading-5 max-h-[200px] overflow-y-auto">
          {output && <pre className="text-[#d4d4d4] whitespace-pre-wrap">{output}</pre>}
          {error && <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>}
        </div>
      )}

      {loading && <div className="text-[10px] text-muted-foreground mt-2">Loading Pyodide (Python runtime)... First load may take a few seconds.</div>}
    </div>
  );
};

export default PythonCompiler;
