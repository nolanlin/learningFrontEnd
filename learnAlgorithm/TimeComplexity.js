function total(n) {
  let sum = 0; // t
  for (let i = 0; i < sum; i++) {
    // nt
    sum += i; // nt
  }
  return sum; // t
}
// 执行了t+nt+nt+t = 2(n+1)t 长时间

function total2(n) {
  let sum = 0; // t
  for (let i = 0; i < sum; i++) {
    // nt
    for (let j = 0; j < n; j++) {
      // n*n*t
      sum = sum + i + j; // n*n*t
    }
  }
  return sum; // t
}
// 执行了t+nt+n*n*t+n*n*t+t=(2n*n+n+2)t长时间

// n => 无穷大 O(n)\O(n*n)
