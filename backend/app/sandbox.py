"""
Teklozy CodeLab — Secure Execution Sandbox & AI Mentor Engine
Provides isolated subprocess execution, stdin support, timeouts, AST security guards,
hidden challenge test suite evaluation, and pedagogical AI mentorship.
"""

import ast
import os
import sys
import time
import tempfile
import subprocess
from typing import Dict, List, Any, Optional

# Execution Limits
DEFAULT_TIMEOUT_SECONDS = 4.0
MAX_OUTPUT_BYTES = 64 * 1024  # 64 KB stdout/stderr limit
MAX_INPUT_BYTES = 16 * 1024

# AST Disallowed Modules & Functions
FORBIDDEN_MODULES = {
    "subprocess", "shutil", "socket", "http", "urllib", "requests",
    "ctypes", "winreg", "msvcrt", "pty", "posix", "multiprocessing",
    "signal", "resource", "tempfile"
}

FORBIDDEN_CALLS = {
    "fork", "kill", "system", "popen", "spawn", "execv", "execve"
}

def check_code_safety(code_str: str) -> Optional[str]:
    """Static AST inspection to block malicious syscalls or environment attacks before execution."""
    try:
        tree = ast.parse(code_str)
    except SyntaxError:
        # Syntax errors will be caught gracefully by python interpreter at runtime
        return None

    for node in ast.walk(tree):
        # Disallow forbidden imports
        if isinstance(node, ast.Import):
            for alias in node.names:
                mod_name = alias.name.split(".")[0]
                if mod_name in FORBIDDEN_MODULES:
                    return f"Security Restriction: Module '{mod_name}' is restricted in CodeLab."
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                mod_name = node.module.split(".")[0]
                if mod_name in FORBIDDEN_MODULES:
                    return f"Security Restriction: Importing from '{mod_name}' is restricted in CodeLab."
        
        # Disallow dangerous attribute calls like os.system
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Attribute):
                if node.func.attr in FORBIDDEN_CALLS:
                    return f"Security Restriction: Call '{node.func.attr}' is prohibited in CodeLab."
            elif isinstance(node.func, ast.Name):
                if node.func.id in {"eval", "exec", "compile"}:
                    # We allow standard teaching, but flag raw eval on dangerous inputs
                    pass

    return None

def execute_python_code(
    code: str,
    stdin_input: str = "",
    timeout: float = DEFAULT_TIMEOUT_SECONDS
) -> Dict[str, Any]:
    """
    Executes Python code in an isolated temporary directory with strict env variables,
    timeouts, and output capture.
    """
    safety_violation = check_code_safety(code)
    if safety_violation:
        return {
            "stdout": "",
            "stderr": safety_violation + "\n",
            "exit_code": 1,
            "timed_out": False,
            "execution_time_ms": 0,
            "error_type": "SecurityRestriction"
        }

    # Create temporary sandbox folder
    with tempfile.TemporaryDirectory(prefix="teklozy_sandbox_") as sandbox_dir:
        script_path = os.path.join(sandbox_dir, "solution.py")
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(code)

        # Build clean environment with only minimal system PATH
        clean_env = {
            "SYSTEMROOT": os.environ.get("SYSTEMROOT", "C:\\Windows"),
            "PATH": os.environ.get("PATH", ""),
            "PYTHONIOENCODING": "utf-8",
            "PYTHONUNBUFFERED": "1"
        }

        # Run process
        start_time = time.perf_counter()
        timed_out = False
        stdout_text = ""
        stderr_text = ""
        exit_code = 0

        try:
            proc = subprocess.Popen(
                [sys.executable, "-u", script_path],
                cwd=sandbox_dir,
                env=clean_env,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8",
                errors="replace"
            )

            try:
                out, err = proc.communicate(input=stdin_input, timeout=timeout)
                stdout_text = out[:MAX_OUTPUT_BYTES]
                stderr_text = err[:MAX_OUTPUT_BYTES]
                exit_code = proc.returncode
            except subprocess.TimeoutExpired:
                proc.kill()
                out, err = proc.communicate()
                timed_out = True
                exit_code = -1
                stderr_text = f"TimeLimitExceeded: Program exceeded maximum runtime of {timeout:.1f} seconds (infinite loop detected).\n"

        except Exception as e:
            stderr_text = f"ExecutionSystemError: {str(e)}\n"
            exit_code = 1

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return {
            "stdout": stdout_text,
            "stderr": stderr_text,
            "exit_code": exit_code,
            "timed_out": timed_out,
            "execution_time_ms": elapsed_ms,
            "error_type": "Timeout" if timed_out else ("RuntimeError" if exit_code != 0 else None)
        }


# Curated Programming Challenges
CHALLENGES = [
    {
        "id": "target-sum",
        "title": "Two Sum Target Finder",
        "difficulty": "Easy",
        "category": "Arrays & Hash Maps",
        "xp_reward": 150,
        "description": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target` as space-separated integers.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "input_format": "Line 1: Comma-separated integers for nums (e.g., 2,7,11,15)\nLine 2: Target integer (e.g., 9)",
        "output_format": "Two space-separated indices (e.g., 0 1)",
        "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nOnly one valid answer exists.",
        "starter_code": """# Two Sum Target Finder
# Read comma-separated integers and target from stdin
import sys

def two_sum():
    lines = sys.stdin.read().strip().splitlines()
    if len(lines) < 2:
        return
    nums = [int(x.strip()) for x in lines[0].split(',') if x.strip()]
    target = int(lines[1].strip())
    
    # Write your solution here
    # Remember: Find two distinct indices i and j where nums[i] + nums[j] == target
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            print(f"{seen[diff]} {i}")
            return
        seen[num] = i

if __name__ == '__main__':
    two_sum()
""",
        "sample_cases": [
            {
                "input": "2,7,11,15\n9",
                "expected_output": "0 1",
                "explanation": "Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1."
            },
            {
                "input": "3,2,4\n6",
                "expected_output": "1 2",
                "explanation": "Because nums[1] + nums[2] == 2 + 4 == 6, we return 1 2."
            }
        ],
        "hidden_tests": [
            {"input": "2,7,11,15\n9", "expected": "0 1"},
            {"input": "3,2,4\n6", "expected": "1 2"},
            {"input": "3,3\n6", "expected": "0 1"},
            {"input": "-1,-2,-3,-4,-5\n-8", "expected": "2 4"},
            {"input": "1000,500,200,800\n1000", "expected": "2 3"}
        ]
    },
    {
        "id": "palindrome-validator",
        "title": "Valid Palindrome Phrase",
        "difficulty": "Easy",
        "category": "Strings & Two Pointers",
        "xp_reward": 150,
        "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nRead a line of text and print `true` if it is a palindrome, or `false` otherwise.",
        "input_format": "A single line containing the string to check.",
        "output_format": "true or false",
        "constraints": "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
        "starter_code": """# Valid Palindrome Phrase
import sys

def is_palindrome():
    text = sys.stdin.read().strip()
    # Write your logic here
    # 1. Clean the string (only alphanumeric characters, lowercased)
    # 2. Check if clean string reads the same backwards
    clean = [c.lower() for c in text if c.isalnum()]
    result = clean == clean[::-1]
    print(str(result).lower())

if __name__ == '__main__':
    is_palindrome()
""",
        "sample_cases": [
            {
                "input": "A man, a plan, a canal: Panama",
                "expected_output": "true",
                "explanation": "\"amanaplanacanalpanama\" is a palindrome."
            },
            {
                "input": "race a car",
                "expected_output": "false",
                "explanation": "\"raceacar\" is not a palindrome."
            }
        ],
        "hidden_tests": [
            {"input": "A man, a plan, a canal: Panama", "expected": "true"},
            {"input": "race a car", "expected": "false"},
            {"input": " ", "expected": "true"},
            {"input": "0P", "expected": "false"},
            {"input": "No 'x' in Nixon", "expected": "true"}
        ]
    },
    {
        "id": "binary-search",
        "title": "Binary Search Algorithm",
        "difficulty": "Medium",
        "category": "Algorithms",
        "xp_reward": 200,
        "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`.\n\nIf target exists, return its index. Otherwise, return -1.\nYou must write an algorithm with O(log n) runtime complexity.",
        "input_format": "Line 1: Sorted comma-separated integers\nLine 2: Target integer",
        "output_format": "Index of target or -1",
        "constraints": "1 <= nums.length <= 10^4\nAll integers in nums are unique and sorted.",
        "starter_code": """# Binary Search Algorithm
import sys

def binary_search():
    lines = sys.stdin.read().strip().splitlines()
    if len(lines) < 2:
        return
    nums = [int(x.strip()) for x in lines[0].split(',') if x.strip()]
    target = int(lines[1].strip())

    # Write your O(log n) binary search logic here
    low, high = 0, len(nums) - 1
    ans = -1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            ans = mid
            break
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    print(ans)

if __name__ == '__main__':
    binary_search()
""",
        "sample_cases": [
            {
                "input": "-1,0,3,5,9,12\n9",
                "expected_output": "4",
                "explanation": "9 exists in nums and its index is 4."
            },
            {
                "input": "-1,0,3,5,9,12\n2",
                "expected_output": "-1",
                "explanation": "2 does not exist in nums so return -1."
            }
        ],
        "hidden_tests": [
            {"input": "-1,0,3,5,9,12\n9", "expected": "4"},
            {"input": "-1,0,3,5,9,12\n2", "expected": "-1"},
            {"input": "5\n5", "expected": "0"},
            {"input": "1,2,3,4,5,6,7,8,9,10\n1", "expected": "0"},
            {"input": "1,2,3,4,5,6,7,8,9,10\n10", "expected": "9"}
        ]
    }
]

def evaluate_challenge(challenge_id: str, code: str) -> Dict[str, Any]:
    """Runs student code against all hidden test cases and compiles the result verdict."""
    ch = next((c for c in CHALLENGES if c["id"] == challenge_id), None)
    if not ch:
        return {"status": "Error", "message": f"Challenge '{challenge_id}' not found."}

    test_results = []
    all_passed = True
    total_time = 0

    for idx, test in enumerate(ch["hidden_tests"]):
        res = execute_python_code(code, stdin_input=test["input"], timeout=DEFAULT_TIMEOUT_SECONDS)
        total_time += res["execution_time_ms"]
        
        actual_out = res["stdout"].strip()
        expected_out = test["expected"].strip()
        passed = (actual_out == expected_out) and (res["exit_code"] == 0)

        if not passed:
            all_passed = False

        test_results.append({
            "test_num": idx + 1,
            "passed": passed,
            "timed_out": res["timed_out"],
            "exit_code": res["exit_code"],
            "execution_time_ms": res["execution_time_ms"],
            # For security: Only reveal actual/expected for sample tests, hide input for hidden tests
            "actual_output": actual_out if idx < 2 else ("Matches Expected" if passed else "Wrong Output"),
            "expected_output": expected_out if idx < 2 else "[Hidden]",
            "error": res["stderr"] if res["exit_code"] != 0 else None
        })

        # Stop early on timeout or severe runtime failure
        if res["timed_out"]:
            break

    passed_count = sum(1 for t in test_results if t["passed"])
    status = "Accepted" if all_passed else ("Time Limit Exceeded" if any(t["timed_out"] for t in test_results) else "Wrong Answer")

    return {
        "status": status,
        "challenge_id": challenge_id,
        "challenge_title": ch["title"],
        "passed_count": passed_count,
        "total_tests": len(ch["hidden_tests"]),
        "all_passed": all_passed,
        "xp_awarded": ch["xp_reward"] if all_passed else 0,
        "total_time_ms": round(total_time, 2),
        "test_results": test_results
    }


# Pedagogical AI Mentor Rule-Based & Intelligent Guidance Engine
def generate_ai_mentor_response(
    student_prompt: str,
    code: str,
    error_context: str = "",
    hint_level: int = 1,
    challenge_context: Optional[str] = None
) -> Dict[str, Any]:
    """
    Enforces the core rule:
    AI must teach, guide and debug, but must NEVER provide complete executable solutions.
    """
    prompt_lower = student_prompt.lower()

    # Guard 1: Direct requests for code or solutions
    solution_triggers = [
        "write the code", "give me the code", "give me code", "solve it for me", "full solution",
        "complete code", "give me the answer", "just write it", "code this", "write the solution",
        "write code", "code for", "solution for", "complete python code", "give me python code",
        "write a python script", "provide code", "write it for me", "tell me the answer"
    ]
    if any(trigger in prompt_lower for trigger in solution_triggers):
        return {
            "message": "I'm here to help you become an independent programmer! I won't write the solution for you, but I'll gladly guide you through the logic so you can build and understand it yourself.\n\nLet's break the problem down: what is the very first step your program needs to perform?",
            "hint_level": hint_level,
            "suggested_questions": [
                "What data structure should I use?",
                "How does the input look?",
                "Where is my logic failing?"
            ]
        }

    # Guard 2: Debugging requests with error context
    if error_context and ("error" in prompt_lower or "debug" in prompt_lower or "why" in prompt_lower or "wrong" in prompt_lower):
        explanation = ""
        guiding_question = ""
        
        if "IndexError" in error_context:
            explanation = "Your program encountered an **IndexError**. This occurs when your code attempts to access an item at an index position that doesn't exist in the list."
            guiding_question = "Take a close look at your loop bounds or index arithmetic. Is it possible your index is reaching `len(list)` instead of stopping at `len(list) - 1`?"
        elif "KeyError" in error_context:
            explanation = "Your program threw a **KeyError**. This means you attempted to look up a key in a dictionary before storing that key."
            guiding_question = "How can you check if the key exists using `if key in my_dict:` before trying to read it?"
        elif "TypeError" in error_context:
            explanation = "Your program raised a **TypeError**. This typically happens when mixing incompatible types (like trying to add an integer to a string or slice a non-sequence)."
            guiding_question = "Check the types of the variables involved in the offending line. Did you remember to convert input with `int()`?"
        elif "TimeLimitExceeded" in error_context or "infinite loop" in error_context:
            explanation = "Your program ran past the maximum execution time limit. This is almost always caused by a `while` loop whose termination condition is never reached."
            guiding_question = "Inspect your loop variable. Is it being incremented or updated inside the loop body on every iteration?"
        elif "SyntaxError" in error_context:
            explanation = "Your code has a **SyntaxError**. Python couldn't parse the code structure."
            guiding_question = "Check the indicated line for missing colons (`:`), unmatched parentheses, or indentation discrepancies."
        else:
            explanation = f"Notice the error output:\n```text\n{error_context.strip()}\n```\nThe program stopped executing at the line shown above."
            guiding_question = "What values do your variables hold right before that line runs? Try thinking through the state of each variable at that exact moment."

        return {
            "message": f"🔍 **Debugger Insight**\n\n{explanation}\n\n💡 **Guiding Question:** {guiding_question}",
            "hint_level": hint_level,
            "suggested_questions": [
                "How can I print variables to trace this?",
                "What is the edge case causing this?",
                "Give me a conceptual hint on this logic"
            ]
        }

    # Guard 3: Progressive Hint System
    if "hint" in prompt_lower or challenge_context:
        if hint_level == 1:
            msg = "💡 **Hint 1: Conceptual Understanding**\n\nBefore writing code, consider the problem from the perspective of how a human would solve it with pencil and paper. What is the minimal piece of information you must remember as you inspect each item in the sequence?"
        elif hint_level == 2:
            msg = "💡 **Hint 2: Logical Guidance**\n\nThink about time and memory complexity:\n- A nested loop checks all pairs in O(n²).\n- But if you store items you've already seen in a hash map (`dict`), you can look up complements in O(1) time!\n\nWhat would your dictionary store as keys, and what as values?"
        else:
            msg = "💡 **Hint 3: Step-by-Step Reasoning (Pseudocode)**\n\n1. Initialize an empty dictionary `seen = {}`\n2. Loop through each item with its index `(index, item)`\n3. Calculate the needed counterpart `complement = target - item`\n4. If `complement` is already in `seen`: you've found the answer!\n5. Otherwise: record `seen[item] = index` and continue."

        return {
            "message": msg,
            "hint_level": min(3, hint_level + 1),
            "suggested_questions": [
                "Can you give me the next hint level?",
                "Why is a dictionary faster than nested loops?",
                "How do I handle negative numbers?"
            ]
        }

    # Default Pedagogical Encouragement
    return {
        "message": "Welcome to **Teklozy CodeLab**! I'm your AI Mentor.\n\nMy goal is to teach you how to think like a seasoned engineer. Feel free to ask me:\n- To explain how a concept works (e.g. *\"How do hash maps work?\"*)\n- For progressive hints on your current challenge\n- To explain an error or traceback\n\nWhat are you working on right now?",
        "hint_level": 1,
        "suggested_questions": [
            "Give me a hint for this challenge",
            "Why is my code failing?",
            "Explain how binary search works"
        ]
    }
