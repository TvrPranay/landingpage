/**
 * Teklozy DSA Dungeon — Curated Curriculum & Problem Dataset
 * 6 Topic Chapters x 12 Curated LeetCode Problems = 72 Comprehensive Challenges
 */

export const DUNGEON_CHAPTERS = [
  {
    id: 1,
    slug: 'arrays-and-strings',
    name: 'Arrays & Strings',
    subtitle: 'DSA Dungeon · Chapter 1 of 6',
    description: 'Master contiguous memory, two-pointer techniques, sliding windows, prefix sums, and hash map lookups.',
    icon: 'nodes',
    gateBadge: '01',
    unlockedByDefault: true,
    requiredProblemsToUnlockNext: 8,
    gateCoords: { left: 33.2, top: 71.3 },
    xpReward: 1000,
    badgeName: 'Array Pioneer Badge',
    problems: [
      {
        id: 1,
        slug: 'two-sum',
        title: '1. Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'The sum of nums[0] and nums[1] is 2 + 7 = 9, so we return [0, 1].'
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation: 'The sum of nums[1] and nums[2] is 2 + 4 = 6, so we return [1, 2].'
          },
          {
            input: 'nums = [3,3], target = 6',
            output: '[0,1]',
            explanation: 'nums[0] + nums[1] == 6, so we return [0, 1].'
          }
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        starterCode: {
          javascript: `function twoSum(nums, target) {
    // Write your solution here
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
          python: `def twoSum(nums, target):
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`
        },
        sampleCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] }
        ],
        testCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] },
          { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
          { input: [[100, 200, 300, 400], 700], expected: [2, 3] },
          { input: [[0, 4, 3, 0], 0], expected: [0, 3] },
          { input: [[1, 5, 8, 12], 13], expected: [0, 3] },
          { input: [[7, 2, 13, 11], 9], expected: [0, 1] },
          { input: [[5, 25, 75], 100], expected: [1, 2] },
          { input: [[-10, 20, 30, -40], -50], expected: [0, 3] },
          { input: [[1000, 500, 200, 800], 1000], expected: [2, 3] },
          { input: [[6, 8, 11, 15, 20], 35], expected: [3, 4] }
        ],
        hints: [
          'A brute-force search checking every pair takes O(n^2) time. Can we do it in a single pass?',
          'As you iterate through the array, what information do you need to look up quickly?',
          'Use a Hash Map / Object to store each number and its index. For every number, check if (target - num) is already in the map.'
        ],
        discussion: 'The optimal solution utilizes a single-pass Hash Map. For each element `nums[i]`, we compute the complement `target - nums[i]`. If the complement exists in our map, we immediately return the stored index and the current index. This reduces time complexity from O(n^2) to O(n) with O(n) auxiliary space.',
        xp: 150
      },
      {
        id: 2,
        slug: 'add-two-numbers',
        title: '2. Add Two Numbers',
        difficulty: 'Medium',
        description: 'You are given two non-empty arrays representing two non-negative integers. The digits are stored in reverse order, and each of their elements contains a single digit.\n\nAdd the two numbers and return the sum as an array in the same reversed order.',
        examples: [
          {
            input: 'l1 = [2,4,3], l2 = [5,6,4]',
            output: '[7,0,8]',
            explanation: '342 + 465 = 807.'
          },
          {
            input: 'l1 = [0], l2 = [0]',
            output: '[0]',
            explanation: '0 + 0 = 0.'
          },
          {
            input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
            output: '[8,9,9,9,0,0,0,1]',
            explanation: '9999999 + 9999 = 10009998.'
          }
        ],
        constraints: [
          'The number of elements in each array is in the range [1, 100].',
          '0 <= elements <= 9',
          'It is guaranteed that the list represents a number that does not have leading zeros.'
        ],
        starterCode: {
          javascript: `function addTwoNumbers(l1, l2) {
    // Write your solution here
    let result = [];
    let carry = 0;
    let i = 0, j = 0;
    while (i < l1.length || j < l2.length || carry > 0) {
        let sum = carry;
        if (i < l1.length) sum += l1[i++];
        if (j < l2.length) sum += l2[j++];
        result.push(sum % 10);
        carry = Math.floor(sum / 10);
    }
    return result;
}`,
          python: `def addTwoNumbers(l1, l2):
    # Write your solution here
    result = []
    carry = 0
    i, j = 0, 0
    while i < len(l1) or j < len(l2) or carry:
        total = carry
        if i < len(l1):
            total += l1[i]; i += 1
        if j < len(l2):
            total += l2[j]; j += 1
        result.append(total % 10)
        carry = total // 10
    return result`
        },
        sampleCases: [
          { input: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
          { input: [[0], [0]], expected: [0] }
        ],
        testCases: [
          { input: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
          { input: [[0], [0]], expected: [0] },
          { input: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] },
          { input: [[1, 8], [0]], expected: [1, 8] },
          { input: [[5], [5]], expected: [0, 1] },
          { input: [[9], [1]], expected: [0, 1] },
          { input: [[1, 2, 3], [4, 5, 6]], expected: [5, 7, 9] },
          { input: [[7], [8]], expected: [5, 1] },
          { input: [[2, 4], [5, 6, 4]], expected: [7, 0, 5] },
          { input: [[9, 9], [1]], expected: [0, 0, 1] },
          { input: [[1, 0, 0, 1], [9]], expected: [0, 1, 0, 1] },
          { input: [[3, 7], [9, 2]], expected: [2, 0, 1] }
        ],
        hints: [
          'Remember elementary school addition: add digit by digit starting from the least significant digit.',
          'Keep track of a carry value across additions.',
          'Do not forget to append the final carry if it is greater than 0 after both lists end.'
        ],
        discussion: 'Simulate digit-by-digit column addition with a carry variable. Runtime is O(max(N, M)) where N and M are the lengths of the two digit lists.',
        xp: 175
      },
      {
        id: 3,
        slug: 'longest-substring-without-repeating-characters',
        title: '3. Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        description: 'Given a string s, find the length of the longest substring without duplicate characters.',
        examples: [
          {
            input: 's = "abcabcbb"',
            output: '3',
            explanation: 'The answer is "abc", with the length of 3.'
          },
          {
            input: 's = "bbbbb"',
            output: '1',
            explanation: 'The answer is "b", with the length of 1.'
          },
          {
            input: 's = "pwwkew"',
            output: '3',
            explanation: 'The answer is "wke", with the length of 3. Notice that "pwke" is a subsequence and not a substring.'
          }
        ],
        constraints: [
          '0 <= s.length <= 5 * 10^4',
          's consists of English letters, digits, symbols and spaces.'
        ],
        starterCode: {
          javascript: `function lengthOfLongestSubstring(s) {
    // Write your solution here
    let seen = new Map();
    let maxLen = 0;
    let left = 0;
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (seen.has(char) && seen.get(char) >= left) {
            left = seen.get(char) + 1;
        }
        seen.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
          python: `def lengthOfLongestSubstring(s):
    # Write your solution here
    seen = {}
    max_len = 0
    left = 0
    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`
        },
        sampleCases: [
          { input: ['abcabcbb'], expected: 3 },
          { input: ['bbbbb'], expected: 1 },
          { input: ['pwwkew'], expected: 3 }
        ],
        testCases: [
          { input: ['abcabcbb'], expected: 3 },
          { input: ['bbbbb'], expected: 1 },
          { input: ['pwwkew'], expected: 3 },
          { input: [''], expected: 0 },
          { input: [' '], expected: 1 },
          { input: ['au'], expected: 2 },
          { input: ['dvdf'], expected: 3 },
          { input: ['abba'], expected: 2 },
          { input: ['tmmzuxt'], expected: 5 },
          { input: ['abcdefghijklmnopqrstuvwxyz'], expected: 26 },
          { input: ['aab'], expected: 2 },
          { input: ['cdd'], expected: 2 }
        ],
        hints: [
          'Use the sliding window pattern with two pointers: left and right.',
          'Store the most recent index of each character in a map.',
          'When a duplicate is encountered, slide left to max(left, seen[char] + 1).'
        ],
        discussion: 'Sliding window technique using a hash map to remember the last seen index of each character. Time complexity is O(n) and space complexity is O(min(m, n)).',
        xp: 175
      },
      {
        id: 4,
        slug: 'median-of-two-sorted-arrays',
        title: '4. Median of Two Sorted Arrays',
        difficulty: 'Hard',
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).',
        examples: [
          {
            input: 'nums1 = [1,3], nums2 = [2]',
            output: '2.0',
            explanation: 'merged array = [1,2,3] and median is 2.'
          },
          {
            input: 'nums1 = [1,2], nums2 = [3,4]',
            output: '2.5',
            explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.'
          }
        ],
        constraints: [
          'nums1.length == m',
          'nums2.length == n',
          '0 <= m <= 1000',
          '0 <= n <= 1000',
          '1 <= m + n <= 2000'
        ],
        starterCode: {
          javascript: `function findMedianSortedArrays(nums1, nums2) {
    // Write your solution here
    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
    const m = nums1.length, n = nums2.length;
    let low = 0, high = m;
    while (low <= high) {
        const partition1 = Math.floor((low + high) / 2);
        const partition2 = Math.floor((m + n + 1) / 2) - partition1;
        const maxLeft1 = partition1 === 0 ? -Infinity : nums1[partition1 - 1];
        const minRight1 = partition1 === m ? Infinity : nums1[partition1];
        const maxLeft2 = partition2 === 0 ? -Infinity : nums2[partition2 - 1];
        const minRight2 = partition2 === n ? Infinity : nums2[partition2];

        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            if ((m + n) % 2 === 0) {
                return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
            } else {
                return Math.max(maxLeft1, maxLeft2);
            }
        } else if (maxLeft1 > minRight2) {
            high = partition1 - 1;
        } else {
            low = partition1 + 1;
        }
    }
    return 0.0;
}`,
          python: `def findMedianSortedArrays(nums1, nums2):
    # Write your solution here
    if len(nums1) > len(nums2):
        return findMedianSortedArrays(nums2, nums1)
    m, n = len(nums1), len(nums2)
    low, high = 0, m
    while low <= high:
        p1 = (low + high) // 2
        p2 = (m + n + 1) // 2 - p1
        maxLeft1 = float('-inf') if p1 == 0 else nums1[p1 - 1]
        minRight1 = float('inf') if p1 == m else nums1[p1]
        maxLeft2 = float('-inf') if p2 == 0 else nums2[p2 - 1]
        minRight2 = float('inf') if p2 == n else nums2[p2]

        if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:
            if (m + n) % 2 == 0:
                return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0
            else:
                return float(max(maxLeft1, maxLeft2))
        elif maxLeft1 > minRight2:
            high = p1 - 1
        else:
            low = p1 + 1
    return 0.0`
        },
        sampleCases: [
          { input: [[1, 3], [2]], expected: 2 },
          { input: [[1, 2], [3, 4]], expected: 2.5 }
        ],
        testCases: [
          { input: [[1, 3], [2]], expected: 2 },
          { input: [[1, 2], [3, 4]], expected: 2.5 },
          { input: [[0, 0], [0, 0]], expected: 0 },
          { input: [[], [1]], expected: 1 },
          { input: [[2], []], expected: 2 },
          { input: [[1, 3, 5], [2, 4, 6]], expected: 3.5 },
          { input: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]], expected: 5.5 },
          { input: [[100001], [100000]], expected: 100000.5 },
          { input: [[1, 2], [-1, 3]], expected: 1.5 },
          { input: [[2, 2, 4, 4], [2, 2, 4, 4]], expected: 3 },
          { input: [[1], [2, 3, 4]], expected: 2.5 },
          { input: [[3], [-2, -1]], expected: -1 }
        ],
        hints: [
          'Binary search on the partition of the smaller array.',
          'Partition both arrays such that the left half has the same number of elements as the right half.',
          'Check if maxLeft1 <= minRight2 and maxLeft2 <= minRight1.'
        ],
        discussion: 'Binary search on the smaller array partition achieves the required O(log(min(m, n))) time complexity.',
        xp: 220
      },
      {
        id: 5,
        slug: 'valid-anagram',
        title: '5. Valid Anagram',
        difficulty: 'Easy',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
        examples: [
          {
            input: 's = "anagram", t = "nagaram"',
            output: 'true',
            explanation: 'Both contain 3 a\'s, 1 n, 1 g, 1 r, and 1 m.'
          },
          {
            input: 's = "rat", t = "car"',
            output: 'false',
            explanation: 'The characters differ.'
          }
        ],
        constraints: [
          '1 <= s.length, t.length <= 5 * 10^4',
          's and t consist of lowercase English letters.'
        ],
        starterCode: {
          javascript: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const count = {};
    for (let c of s) count[c] = (count[c] || 0) + 1;
    for (let c of t) {
        if (!count[c]) return false;
        count[c]--;
    }
    return true;
}`,
          python: `def isAnagram(s, t):
    if len(s) != len(t):
        return False
    from collections import Counter
    return Counter(s) == Counter(t)`
        },
        sampleCases: [
          { input: ['anagram', 'nagaram'], expected: true },
          { input: ['rat', 'car'], expected: false }
        ],
        testCases: [
          { input: ['anagram', 'nagaram'], expected: true },
          { input: ['rat', 'car'], expected: false },
          { input: ['a', 'a'], expected: true },
          { input: ['ab', 'a'], expected: false },
          { input: ['listen', 'silent'], expected: true },
          { input: ['triangle', 'integral'], expected: true },
          { input: ['apple', 'pale'], expected: false },
          { input: ['night', 'thing'], expected: true },
          { input: ['dusty', 'rusty'], expected: false },
          { input: ['state', 'taste'], expected: true },
          { input: ['binary', 'brainy'], expected: true },
          { input: ['adobe', 'abode'], expected: true }
        ],
        hints: ['Compare frequency counts of characters in both strings.'],
        discussion: 'Frequency map counting runs in O(n) time and O(1) space since character set is fixed (26 letters).',
        xp: 130
      },
      {
        id: 6,
        slug: 'group-anagrams',
        title: '6. Group Anagrams',
        difficulty: 'Medium',
        description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
        examples: [
          {
            input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
            output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
            explanation: 'Anagrams are clustered by common character frequency.'
          }
        ],
        constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
        starterCode: {
          javascript: `function groupAnagrams(strs) {
    const map = {};
    for (const str of strs) {
        const key = str.split('').sort().join('');
        if (!map[key]) map[key] = [];
        map[key].push(str);
    }
    return Object.values(map);
}`,
          python: `def groupAnagrams(strs):
    from collections import defaultdict
    ans = defaultdict(list)
    for s in strs:
        ans[tuple(sorted(s))].append(s)
    return list(ans.values())`
        },
        sampleCases: [
          { input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] }
        ],
        testCases: [
          { input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] },
          { input: [['']], expected: [['']] },
          { input: [['a']], expected: [['a']] },
          { input: [['ab', 'ba']], expected: [['ab', 'ba']] },
          { input: [['cab', 'tin', 'pew', 'duh', 'may', 'ill', 'buy', 'bar', 'max', 'doc']], expected: [['cab'], ['tin'], ['pew'], ['duh'], ['may'], ['ill'], ['buy'], ['bar'], ['max'], ['doc']] },
          { input: [['listen', 'silent', 'enlist']], expected: [['listen', 'silent', 'enlist']] },
          { input: [['rats', 'star', 'tars', 'arts']], expected: [['rats', 'star', 'tars', 'arts']] },
          { input: [['no', 'on', 'yes']], expected: [['no', 'on'], ['yes']] },
          { input: [['cat', 'dog', 'tac', 'god', 'act']], expected: [['cat', 'tac', 'act'], ['dog', 'god']] },
          { input: [['abc', 'bca', 'cab', 'xyz']], expected: [['abc', 'bca', 'cab'], ['xyz']] },
          { input: [['stop', 'pots', 'tops', 'spot', 'post']], expected: [['stop', 'pots', 'tops', 'spot', 'post']] },
          { input: [['word', 'drow']], expected: [['word', 'drow']] }
        ],
        hints: ['Use the sorted character string or a character count tuple as a dictionary key.'],
        discussion: 'Sorting each word takes O(K log K) time. Grouping via Hash Map gives O(N * K log K) overall.',
        xp: 175
      },
      {
        id: 7,
        slug: 'longest-palindromic-substring',
        title: '7. Longest Palindromic Substring',
        difficulty: 'Medium',
        description: 'Given a string s, return the longest palindromic substring in s.',
        examples: [
          { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
          { input: 's = "cbbd"', output: '"bb"', explanation: 'Longest palindrome is "bb".' }
        ],
        constraints: ['1 <= s.length <= 1000'],
        starterCode: {
          javascript: `function longestPalindrome(s) {
    if (s.length <= 1) return s;
    let start = 0, maxLen = 1;
    function expand(l, r) {
        while (l >= 0 && r < s.length && s[l] === s[r]) {
            if (r - l + 1 > maxLen) {
                start = l;
                maxLen = r - l + 1;
            }
            l--;
            r++;
        }
    }
    for (let i = 0; i < s.length; i++) {
        expand(i, i);
        expand(i, i + 1);
    }
    return s.substring(start, start + maxLen);
}`,
          python: `def longestPalindrome(s):
    if len(s) <= 1: return s
    start, max_len = 0, 1
    def expand(l, r):
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > max_len:
                start = l
                max_len = r - l + 1
            l -= 1; r += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start + max_len]`
        },
        sampleCases: [
          { input: ['babad'], expected: 'bab' },
          { input: ['cbbd'], expected: 'bb' }
        ],
        testCases: [
          { input: ['babad'], expected: 'bab' },
          { input: ['cbbd'], expected: 'bb' },
          { input: ['a'], expected: 'a' },
          { input: ['ac'], expected: 'a' },
          { input: ['racecar'], expected: 'racecar' },
          { input: ['noon'], expected: 'noon' },
          { input: ['forgeeksskeegfor'], expected: 'geeksskeeg' },
          { input: ['ccc'], expected: 'ccc' },
          { input: ['aaaa'], expected: 'aaaa' },
          { input: ['abacdfgdcaba'], expected: 'aba' },
          { input: ['aacabdkacaa'], expected: 'aca' },
          { input: ['bananas'], expected: 'anana' }
        ],
        hints: ['Expand outwards around each center index (both single character and pair).'],
        discussion: 'Expanding around all 2N - 1 possible centers takes O(N^2) time and O(1) space.',
        xp: 180
      },
      {
        id: 8,
        slug: 'string-to-integer-atoi',
        title: '8. String to Integer (atoi)',
        difficulty: 'Medium',
        description: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++\'s atoi function).\n\nRead leading whitespace, check for sign, read digits, and clamp to [-2^31, 2^31 - 1].',
        examples: [
          { input: 's = "42"', output: '42', explanation: 'Read "42" into integer 42.' },
          { input: 's = "   -42"', output: '-42', explanation: 'Leading whitespace is ignored, minus sign read.' }
        ],
        constraints: ['0 <= s.length <= 200'],
        starterCode: {
          javascript: `function myAtoi(s) {
    let str = s.trim();
    if (!str) return 0;
    let sign = 1, idx = 0, num = 0;
    if (str[0] === '-') { sign = -1; idx++; }
    else if (str[0] === '+') { idx++; }
    const MAX = 2147483647, MIN = -2147483648;
    while (idx < str.length && str[idx] >= '0' && str[idx] <= '9') {
        num = num * 10 + (str.charCodeAt(idx) - 48);
        if (sign * num >= MAX) return MAX;
        if (sign * num <= MIN) return MIN;
        idx++;
    }
    return sign * num;
}`,
          python: `def myAtoi(s):
    s = s.lstrip()
    if not s: return 0
    sign = 1; idx = 0; num = 0
    if s[0] == '-': sign = -1; idx += 1
    elif s[0] == '+': idx += 1
    MAX = 2**31 - 1; MIN = -2**31
    while idx < len(s) and s[idx].isdigit():
        num = num * 10 + int(s[idx])
        if sign * num >= MAX: return MAX
        if sign * num <= MIN: return MIN
        idx += 1
    return sign * num`
        },
        sampleCases: [{ input: ['42'], expected: 42 }, { input: ['   -42'], expected: -42 }],
        testCases: [
          { input: ['42'], expected: 42 },
          { input: ['   -42'], expected: -42 },
          { input: ['4193 with words'], expected: 4193 },
          { input: ['words and 987'], expected: 0 },
          { input: ['-91283472332'], expected: -2147483648 },
          { input: ['+1'], expected: 1 },
          { input: ['+-12'], expected: 0 },
          { input: ['00000-42a1234'], expected: 0 },
          { input: ['21474836460'], expected: 2147483647 },
          { input: ['  0000000000012345678'], expected: 12345678 },
          { input: [''], expected: 0 },
          { input: ['2147483648'], expected: 2147483647 }
        ],
        hints: ['Watch out for overflow conditions and invalid non-digit prefixes.'],
        discussion: 'State machine / sequential scanner handling whitespace, sign, digits, and 32-bit limits.',
        xp: 160
      },
      {
        id: 9,
        slug: 'reverse-words-in-a-string',
        title: '9. Reverse Words in a String',
        difficulty: 'Easy',
        description: 'Given an input string s, reverse the order of the words.\n\nA word is defined as a sequence of non-space characters. Return a string of the words in reverse order concatenated by a single space.',
        examples: [
          { input: 's = "the sky is blue"', output: '"blue is sky the"', explanation: 'Words are reversed.' }
        ],
        constraints: ['1 <= s.length <= 10^4'],
        starterCode: {
          javascript: `function reverseWords(s) {
    return s.trim().split(/\\s+/).reverse().join(' ');
}`,
          python: `def reverseWords(s):
    return ' '.join(s.split()[::-1])`
        },
        sampleCases: [{ input: ['the sky is blue'], expected: 'blue is sky the' }],
        testCases: [
          { input: ['the sky is blue'], expected: 'blue is sky the' },
          { input: ['  hello world  '], expected: 'world hello' },
          { input: ['a good   example'], expected: 'example good a' },
          { input: ['Alice does not even like bob'], expected: 'bob like even not does Alice' },
          { input: ['EPIC'], expected: 'EPIC' },
          { input: ['one two three'], expected: 'three two one' },
          { input: ['  single  '], expected: 'single' },
          { input: ['1 2 3 4 5'], expected: '5 4 3 2 1' },
          { input: ['  Bob    Loves  Alice   '], expected: 'Alice Loves Bob' },
          { input: ['first second'], expected: 'second first' },
          { input: ['keep coding'], expected: 'coding keep' },
          { input: ['ready set go'], expected: 'go set ready' }
        ],
        hints: ['Split by arbitrary whitespace and reverse the tokens.'],
        discussion: 'Tokenization and reversal run in linear O(N) time.',
        xp: 130
      },
      {
        id: 10,
        slug: 'implement-strstr',
        title: '10. Implement strStr()',
        difficulty: 'Medium',
        description: 'Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.',
        examples: [
          { input: 'haystack = "sadbutsad", needle = "sad"', output: '0', explanation: '"sad" starts at 0.' }
        ],
        constraints: ['1 <= haystack.length, needle.length <= 10^4'],
        starterCode: {
          javascript: `function strStr(haystack, needle) {
    return haystack.indexOf(needle);
}`,
          python: `def strStr(haystack, needle):
    return haystack.find(needle)`
        },
        sampleCases: [{ input: ['sadbutsad', 'sad'], expected: 0 }],
        testCases: [
          { input: ['sadbutsad', 'sad'], expected: 0 },
          { input: ['leetcode', 'leeto'], expected: -1 },
          { input: ['hello', 'll'], expected: 2 },
          { input: ['aaaaa', 'bba'], expected: -1 },
          { input: ['mississippi', 'issip'], expected: 4 },
          { input: ['a', 'a'], expected: 0 },
          { input: ['abc', 'c'], expected: 2 },
          { input: ['abcde', 'e'], expected: 4 },
          { input: ['teklozy', 'lozy'], expected: 3 },
          { input: ['algorithm', 'gori'], expected: 2 },
          { input: ['programming', 'gram'], expected: 3 },
          { input: ['dungeon', 'on'], expected: 5 }
        ],
        hints: ['Use sliding substring search or KMP algorithm.'],
        discussion: 'Can be solved in O(N) via KMP prefix matching or O(N*M) naive string scan.',
        xp: 160
      },
      {
        id: 11,
        slug: 'count-and-say',
        title: '11. Count and Say',
        difficulty: 'Medium',
        description: 'The count-and-say sequence is a sequence of digit strings defined by the recursive formula: countAndSay(1) = "1", and countAndSay(n) is the run-length encoding of countAndSay(n - 1).',
        examples: [
          { input: 'n = 4', output: '"1211"', explanation: 'countAndSay(1) = "1", (2)="11", (3)="21", (4)="1211".' }
        ],
        constraints: ['1 <= n <= 30'],
        starterCode: {
          javascript: `function countAndSay(n) {
    let curr = "1";
    for (let i = 2; i <= n; i++) {
        let next = "", count = 1;
        for (let j = 0; j < curr.length; j++) {
            if (curr[j] === curr[j + 1]) count++;
            else { next += count + curr[j]; count = 1; }
        }
        curr = next;
    }
    return curr;
}`,
          python: `def countAndSay(n):
    curr = "1"
    for _ in range(2, n + 1):
        next_s = []; count = 1
        for j in range(len(curr)):
            if j + 1 < len(curr) and curr[j] == curr[j + 1]:
                count += 1
            else:
                next_s.append(str(count) + curr[j])
                count = 1
        curr = "".join(next_s)
    return curr`
        },
        sampleCases: [{ input: [4], expected: '1211' }],
        testCases: [
          { input: [1], expected: '1' },
          { input: [2], expected: '11' },
          { input: [3], expected: '21' },
          { input: [4], expected: '1211' },
          { input: [5], expected: '111221' },
          { input: [6], expected: '312211' },
          { input: [7], expected: '13112221' },
          { input: [8], expected: '1113213211' },
          { input: [9], expected: '31131211131221' },
          { input: [10], expected: '13211311123113112211' },
          { input: [11], expected: '11131221133112132113212221' },
          { input: [12], expected: '3113112221232112111312211312111213322111' }
        ],
        hints: ['Simulate run-length compression iteratively from n=1.'],
        discussion: 'Iterative compression producing sequence strings.',
        xp: 170
      },
      {
        id: 12,
        slug: 'compare-version-numbers',
        title: '12. Compare Version Numbers',
        difficulty: 'Hard',
        description: 'Given two version strings version1 and version2, compare them. Return 1 if version1 > version2, -1 if version1 < version2, and 0 if equal.',
        examples: [
          { input: 'version1 = "1.01", version2 = "1.001"', output: '0', explanation: 'Ignoring leading zeros, both are 1.1.' }
        ],
        constraints: ['1 <= version1.length, version2.length <= 500'],
        starterCode: {
          javascript: `function compareVersion(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    const len = Math.max(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
        const n1 = v1[i] || 0;
        const n2 = v2[i] || 0;
        if (n1 > n2) return 1;
        if (n1 < n2) return -1;
    }
    return 0;
}`,
          python: `def compareVersion(version1, version2):
    v1 = [int(x) for x in version1.split('.')]
    v2 = [int(x) for x in version2.split('.')]
    max_len = max(len(v1), len(v2))
    for i in range(max_len):
        n1 = v1[i] if i < len(v1) else 0
        n2 = v2[i] if i < len(v2) else 0
        if n1 > n2: return 1
        if n1 < n2: return -1
    return 0`
        },
        sampleCases: [{ input: ['1.01', '1.001'], expected: 0 }],
        testCases: [
          { input: ['1.01', '1.001'], expected: 0 },
          { input: ['1.0', '1.0.0'], expected: 0 },
          { input: ['0.1', '1.1'], expected: -1 },
          { input: ['1.0.1', '1'], expected: 1 },
          { input: ['7.5.2.4', '7.5.3'], expected: -1 },
          { input: ['1.01.1', '1.1.1'], expected: 0 },
          { input: ['2.1', '2.01'], expected: 0 },
          { input: ['3.4.5', '3.4.6'], expected: -1 },
          { input: ['4.0', '4.0.0.1'], expected: -1 },
          { input: ['10.2.0', '10.2'], expected: 0 },
          { input: ['1.2.3', '1.2.3.0.0'], expected: 0 },
          { input: ['5.0.0.1', '5'], expected: 1 }
        ],
        hints: ['Split versions by "." and compare each revision number numerically.'],
        discussion: 'Linear comparison with default 0 for missing revisions.',
        xp: 200
      }
    ]
  },
  {
    id: 2,
    slug: 'linked-list',
    name: 'Linked List',
    subtitle: 'DSA Dungeon · Chapter 2 of 6',
    description: 'Pointers, cycle detection, reordering, merging, and fast & slow runner techniques.',
    icon: 'layers',
    gateBadge: '02',
    unlockedByDefault: false,
    requiredProblemsToUnlockNext: 8,
    gateCoords: { left: 53.7, top: 67.5 },
    xpReward: 1200,
    badgeName: 'Chain Master Badge',
    problems: [
      {
        id: 13,
        slug: 'reverse-linked-list',
        title: '1. Reverse Linked List',
        difficulty: 'Easy',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed order.' }],
        constraints: ['0 <= nodes <= 5000'],
        starterCode: {
          javascript: `function reverseList(head) {
    let prev = null, curr = head;
    while (curr) {
        let nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`,
          python: `def reverseList(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`
        },
        sampleCases: [{ input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] }],
        testCases: [
          { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
          { input: [[1, 2]], expected: [2, 1] },
          { input: [[]], expected: [] },
          { input: [[1]], expected: [1] },
          { input: [[10, 20, 30]], expected: [30, 20, 10] },
          { input: [[1, 2, 3, 4, 5, 6]], expected: [6, 5, 4, 3, 2, 1] },
          { input: [[9, 9, 9]], expected: [9, 9, 9] },
          { input: [[4, 8, 15, 16, 23, 42]], expected: [42, 23, 16, 15, 8, 4] },
          { input: [[7, 3, 1]], expected: [1, 3, 7] },
          { input: [[5, 4, 3, 2, 1, 0]], expected: [0, 1, 2, 3, 4, 5] },
          { input: [[100, 200]], expected: [200, 100] },
          { input: [[2, 4, 6, 8]], expected: [8, 6, 4, 2] }
        ],
        hints: ['Maintain three pointers: prev, curr, and next.'],
        discussion: 'Iterative pointer redirection takes O(N) time and O(1) space.',
        xp: 140
      },
      {
        id: 14,
        slug: 'merge-two-sorted-lists',
        title: '2. Merge Two Sorted Lists',
        difficulty: 'Easy',
        description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.',
        examples: [{ input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Merged in sorted order.' }],
        constraints: ['0 <= nodes <= 50'],
        starterCode: {
          javascript: `function mergeTwoLists(l1, l2) {
    let dummy = { next: null }, tail = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
        else { tail.next = l2; l2 = l2.next; }
        tail = tail.next;
    }
    tail.next = l1 || l2;
    return dummy.next;
}`,
          python: `def mergeTwoLists(l1, l2):
    dummy = ListNode(); tail = dummy
    while l1 and l2:
        if l1.val <= l2.val: tail.next = l1; l1 = l1.next
        else: tail.next = l2; l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next`
        },
        sampleCases: [{ input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] }],
        testCases: [
          { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
          { input: [[], []], expected: [] },
          { input: [[], [0]], expected: [0] },
          { input: [[5], [1, 2, 4]], expected: [1, 2, 4, 5] },
          { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
          { input: [[1], [2]], expected: [1, 2] },
          { input: [[2], [1]], expected: [1, 2] },
          { input: [[1, 2, 3], []], expected: [1, 2, 3] },
          { input: [[10, 20], [15, 25]], expected: [10, 15, 20, 25] },
          { input: [[3, 7], [1, 9]], expected: [1, 3, 7, 9] },
          { input: [[2, 2], [2, 2]], expected: [2, 2, 2, 2] },
          { input: [[0, 5, 10], [1, 6, 11]], expected: [0, 1, 5, 6, 10, 11] }
        ],
        hints: ['Use a dummy head to simplify edge conditions.'],
        discussion: 'Iterative merge takes O(N + M) time and O(1) extra space.',
        xp: 140
      },
      { id: 15, slug: 'linked-list-cycle', title: '3. Linked List Cycle', difficulty: 'Easy', xp: 140, description: 'Determine if the linked list has a cycle using Floyd\'s Tortoise and Hare.' },
      { id: 16, slug: 'remove-nth-node', title: '4. Remove Nth Node From End', difficulty: 'Medium', xp: 160, description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.' },
      { id: 17, slug: 'reorder-list', title: '5. Reorder List', difficulty: 'Medium', xp: 180, description: 'Reorder the list to be: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → ...' },
      { id: 18, slug: 'copy-list-with-random-pointer', title: '6. Copy List with Random Pointer', difficulty: 'Medium', xp: 190, description: 'Construct a deep copy of a linked list with next and random pointers.' },
      { id: 19, slug: 'merge-k-sorted-lists', title: '7. Merge k Sorted Lists', difficulty: 'Hard', xp: 220, description: 'Merge k sorted linked lists and return it as one sorted list using a min-heap.' },
      { id: 20, slug: 'reverse-nodes-in-k-group', title: '8. Reverse Nodes in k-Group', difficulty: 'Hard', xp: 230, description: 'Reverse the nodes of a linked list k at a time and return its modified list.' },
      { id: 21, slug: 'palindrome-linked-list', title: '9. Palindrome Linked List', difficulty: 'Easy', xp: 140, description: 'Given the head of a singly linked list, return true if it is a palindrome.' },
      { id: 22, slug: 'intersection-of-two-linked-lists', title: '10. Intersection of Two Linked Lists', difficulty: 'Easy', xp: 150, description: 'Find the node at which the intersection of two singly linked lists begins.' },
      { id: 23, slug: 'sort-list', title: '11. Sort List', difficulty: 'Medium', xp: 180, description: 'Given the head of a linked list, return the list after sorting it in O(n log n) time.' },
      { id: 24, slug: 'swap-nodes-in-pairs', title: '12. Swap Nodes in Pairs', difficulty: 'Medium', xp: 170, description: 'Swap every two adjacent nodes and return its head without modifying node values.' }
    ]
  },
  {
    id: 3,
    slug: 'trees',
    name: 'Trees',
    subtitle: 'DSA Dungeon · Chapter 3 of 6',
    description: 'Binary trees, BST invariants, DFS traversals, BFS level-order, and tree serialization.',
    icon: 'git-branch',
    gateBadge: '03',
    unlockedByDefault: false,
    requiredProblemsToUnlockNext: 8,
    gateCoords: { left: 42.0, top: 46.9 },
    xpReward: 1400,
    badgeName: 'Arboreal Sage Badge',
    problems: [
      { id: 25, slug: 'maximum-depth-of-binary-tree', title: '1. Maximum Depth of Binary Tree', difficulty: 'Easy', xp: 140, description: 'Given the root of a binary tree, return its maximum depth.' },
      { id: 26, slug: 'same-tree', title: '2. Same Tree', difficulty: 'Easy', xp: 130, description: 'Check if two binary trees are structurally identical and have same values.' },
      { id: 27, slug: 'invert-binary-tree', title: '3. Invert Binary Tree', difficulty: 'Easy', xp: 130, description: 'Invert a binary tree and return its root.' },
      { id: 28, slug: 'binary-tree-level-order-traversal', title: '4. Binary Tree Level Order Traversal', difficulty: 'Medium', xp: 170, description: 'Return level order traversal of node values (left to right, level by level).' },
      { id: 29, slug: 'validate-binary-search-tree', title: '5. Validate Binary Search Tree', difficulty: 'Medium', xp: 180, description: 'Determine if a binary tree is a valid binary search tree (BST).' },
      { id: 30, slug: 'kth-smallest-element-in-a-bst', title: '6. Kth Smallest Element in a BST', difficulty: 'Medium', xp: 175, description: 'Find the kth smallest value (1-indexed) in a BST.' },
      { id: 31, slug: 'construct-binary-tree-from-preorder-and-inorder', title: '7. Construct Tree from Preorder and Inorder', difficulty: 'Medium', xp: 190, description: 'Construct and return the binary tree from preorder and inorder traversals.' },
      { id: 32, slug: 'lowest-common-ancestor-of-a-bst', title: '8. Lowest Common Ancestor of a BST', difficulty: 'Medium', xp: 170, description: 'Find the lowest common ancestor (LCA) node of two given nodes in a BST.' },
      { id: 33, slug: 'binary-tree-maximum-path-sum', title: '9. Binary Tree Maximum Path Sum', difficulty: 'Hard', xp: 230, description: 'A path in a binary tree is a sequence of nodes. Return maximum path sum.' },
      { id: 34, slug: 'serialize-and-deserialize-binary-tree', title: '10. Serialize & Deserialize Binary Tree', difficulty: 'Hard', xp: 240, description: 'Design an algorithm to serialize and deserialize a binary tree.' },
      { id: 35, slug: 'diameter-of-binary-tree', title: '11. Diameter of Binary Tree', difficulty: 'Easy', xp: 140, description: 'Return the length of the diameter of the tree (longest path between any two nodes).' },
      { id: 36, slug: 'balanced-binary-tree', title: '12. Balanced Binary Tree', difficulty: 'Easy', xp: 140, description: 'Determine if a binary tree is height-balanced.' }
    ]
  },
  {
    id: 4,
    slug: 'graphs',
    name: 'Graphs',
    subtitle: 'DSA Dungeon · Chapter 4 of 6',
    description: 'Adjacency lists, BFS shortest paths, topological sort, Dijkstra, and connected components.',
    icon: 'network',
    gateBadge: '04',
    unlockedByDefault: false,
    requiredProblemsToUnlockNext: 8,
    gateCoords: { left: 67.4, top: 50.7 },
    xpReward: 1600,
    badgeName: 'Graph Cartographer Badge',
    problems: [
      { id: 37, slug: 'number-of-islands', title: '1. Number of Islands', difficulty: 'Medium', xp: 180, description: 'Given an m x n 2D binary grid, count the number of islands.' },
      { id: 38, slug: 'clone-graph', title: '2. Clone Graph', difficulty: 'Medium', xp: 180, description: 'Given a reference of a node in a connected undirected graph, return a deep copy.' },
      { id: 39, slug: 'pacific-atlantic-water-flow', title: '3. Pacific Atlantic Water Flow', difficulty: 'Medium', xp: 190, description: 'Return a 2D list of grid coordinates where water can flow to both oceans.' },
      { id: 40, slug: 'course-schedule', title: '4. Course Schedule', difficulty: 'Medium', xp: 190, description: 'Determine if you can finish all courses given prerequisites using cycle detection.' },
      { id: 41, slug: 'course-schedule-ii', title: '5. Course Schedule II', difficulty: 'Medium', xp: 190, description: 'Return the ordering of courses you should take to finish all courses (Topological sort).' },
      { id: 42, slug: 'rotting-oranges', title: '6. Rotting Oranges', difficulty: 'Medium', xp: 180, description: 'Multi-source BFS to find minimum minutes until no fresh orange remains.' },
      { id: 43, slug: 'word-ladder', title: '7. Word Ladder', difficulty: 'Hard', xp: 230, description: 'Return the number of words in the shortest transformation sequence.' },
      { id: 44, slug: 'network-delay-time', title: '8. Network Delay Time', difficulty: 'Medium', xp: 185, description: 'Dijkstra shortest path algorithm to calculate total signal broadcast delay.' },
      { id: 45, slug: 'cheapest-flights-within-k-stops', title: '9. Cheapest Flights Within K Stops', difficulty: 'Medium', xp: 195, description: 'Bellman-Ford / BFS with queue to find cheapest price.' },
      { id: 46, slug: 'alien-dictionary', title: '10. Alien Dictionary', difficulty: 'Hard', xp: 240, description: 'Derive the alien alphabetical order using topological sorting.' },
      { id: 47, slug: 'redundant-connection', title: '11. Redundant Connection', difficulty: 'Medium', xp: 180, description: 'Find an edge that can be removed so that the resulting graph is a tree (Union Find).' },
      { id: 48, slug: 'surrounded-regions', title: '12. Surrounded Regions', difficulty: 'Medium', xp: 175, description: 'Capture all regions that are 4-directionally surrounded by X.' }
    ]
  },
  {
    id: 5,
    slug: 'dynamic-programming',
    name: 'Dynamic Programming',
    subtitle: 'DSA Dungeon · Chapter 5 of 6',
    description: 'Overlapping subproblems, memoization, tabular bottoms-up, knapsack, and transition states.',
    icon: 'layout-grid',
    gateBadge: '05',
    unlockedByDefault: false,
    requiredProblemsToUnlockNext: 8,
    gateCoords: { left: 55.2, top: 35.6 },
    xpReward: 1800,
    badgeName: 'DP Architect Badge',
    problems: [
      { id: 49, slug: 'climbing-stairs', title: '1. Climbing Stairs', difficulty: 'Easy', xp: 130, description: 'Distinct ways to climb n steps where you can take 1 or 2 steps.' },
      { id: 50, slug: 'coin-change', title: '2. Coin Change', difficulty: 'Medium', xp: 185, description: 'Fewest number of coins needed to make up amount.' },
      { id: 51, slug: 'longest-increasing-subsequence', title: '3. Longest Increasing Subsequence', difficulty: 'Medium', xp: 190, description: 'Return length of longest strictly increasing subsequence.' },
      { id: 52, slug: 'longest-common-subsequence', title: '4. Longest Common Subsequence', difficulty: 'Medium', xp: 190, description: 'Return length of longest common subsequence of two strings.' },
      { id: 53, slug: 'word-break', title: '5. Word Break', difficulty: 'Medium', xp: 180, description: 'Determine if s can be segmented into dictionary words.' },
      { id: 54, slug: 'house-robber', title: '6. House Robber', difficulty: 'Medium', xp: 170, description: 'Maximum amount of money you can rob without alerting police (no adjacent).' },
      { id: 55, slug: 'house-robber-ii', title: '7. House Robber II', difficulty: 'Medium', xp: 180, description: 'Houses arranged in a circle.' },
      { id: 56, slug: 'decode-ways', title: '8. Decode Ways', difficulty: 'Medium', xp: 180, description: 'Number of ways to decode string of digits to letters.' },
      { id: 57, slug: 'unique-paths', title: '9. Unique Paths', difficulty: 'Medium', xp: 170, description: 'Robot in top-left corner must reach bottom-right.' },
      { id: 58, slug: 'jump-game', title: '10. Jump Game', difficulty: 'Medium', xp: 170, description: 'Determine if you can reach the last index.' },
      { id: 59, slug: 'partition-equal-subset-sum', title: '11. Partition Equal Subset Sum', difficulty: 'Medium', xp: 185, description: 'Can array be partitioned into two subsets with equal sum?' },
      { id: 60, slug: 'edit-distance', title: '12. Edit Distance', difficulty: 'Hard', xp: 240, description: 'Minimum number of operations to convert word1 to word2.' }
    ]
  },
  {
    id: 6,
    slug: 'advanced-problems',
    name: 'Advanced Problems',
    subtitle: 'DSA Dungeon · Chapter 6 of 6',
    description: 'Trie structures, segment trees, LRU cache, sliding window maximum, and grandmaster challenges.',
    icon: 'crown',
    gateBadge: '06',
    unlockedByDefault: false,
    requiredProblemsToUnlockNext: 12,
    gateCoords: { left: 70.3, top: 26.3 },
    xpReward: 2500,
    badgeName: 'Grandmaster Dungeon Slayer Badge',
    problems: [
      { id: 61, slug: 'trapping-rain-water', title: '1. Trapping Rain Water', difficulty: 'Hard', xp: 240, description: 'Compute how much water it can trap after raining.' },
      { id: 62, slug: 'lru-cache', title: '2. LRU Cache', difficulty: 'Medium', xp: 190, description: 'Design a data structure that follows the Least Recently Used (LRU) cache constraints.' },
      { id: 63, slug: 'sliding-window-maximum', title: '3. Sliding Window Maximum', difficulty: 'Hard', xp: 240, description: 'Sliding window max using a monotonic deque in O(N).' },
      { id: 64, slug: 'minimum-window-substring', title: '4. Minimum Window Substring', difficulty: 'Hard', xp: 250, description: 'Smallest substring of s such that every character in t is included.' },
      { id: 65, slug: 'implement-trie-prefix-tree', title: '5. Implement Trie (Prefix Tree)', difficulty: 'Medium', xp: 180, description: 'Implement insert, search, and startsWith.' },
      { id: 66, slug: 'word-search-ii', title: '6. Word Search II', difficulty: 'Hard', xp: 250, description: 'Find all words on 2D board using Trie and Backtracking.' },
      { id: 67, slug: 'median-finder-data-stream', title: '7. Find Median from Data Stream', difficulty: 'Hard', xp: 240, description: 'Two heaps (max-heap & min-heap) to maintain dynamic median.' },
      { id: 68, slug: 'merge-intervals', title: '8. Merge Intervals', difficulty: 'Medium', xp: 175, description: 'Merge all overlapping intervals.' },
      { id: 69, slug: 'insert-interval', title: '9. Insert Interval', difficulty: 'Medium', xp: 175, description: 'Insert newInterval into sorted non-overlapping intervals.' },
      { id: 70, slug: 'n-queens', title: '10. N-Queens', difficulty: 'Hard', xp: 250, description: 'Place n queens on an n x n chessboard so no two queens attack each other.' },
      { id: 71, slug: 'palindrome-partitioning', title: '11. Palindrome Partitioning', difficulty: 'Medium', xp: 180, description: 'Partition s such that every substring is a palindrome.' },
      { id: 72, slug: 'regular-expression-matching', title: '12. Regular Expression Matching', difficulty: 'Hard', xp: 260, description: 'Implement regex matching with support for "." and "*".' }
    ]
  }
];

// Helper to look up any problem by slug or id
export function getProblemBySlug(slug) {
  for (const ch of DUNGEON_CHAPTERS) {
    const found = ch.problems.find(p => p.slug === slug || String(p.id) === String(slug));
    if (found) return { problem: found, chapter: ch };
  }
  return null;
}

// Helper to get total problems count
export const TOTAL_DUNGEON_PROBLEMS = DUNGEON_CHAPTERS.reduce((acc, ch) => acc + ch.problems.length, 0);
