export function autoGrowTextarea(e) {
  //auto grow cho textarea
  if (e.target.value === "") {
    console.log("empty textarea")
    e.target.style.height = "5px";
  }
  e.target.style.height = "5px";
  e.target.style.height = e.target.scrollHeight + "px";
}
