function formatNameAndEmitEvent(userNameList, inputtedUserName) {
  let appendedUserName = inputtedUserName;
  // 入力文字列+"_"+数字 に一致する正規表現
  const sameNameReg = new RegExp("^" + inputtedUserName + "(_[0-9]*)?$");
  // sameNameRegで一致する文字列のみを残したリストを作成
  const sameNames = userNameList.filter(function (name) {
    console.log("name.match(sameNameReg): " + name.match(sameNameReg));
    return name.match(sameNameReg) !== null;
  });
  console.log(inputtedUserName);
  console.log("sameNames: " + sameNames);
  console.log("sameNameReg: " + sameNameReg);
  const sameNameMenberNum = sameNames.length;
  if (sameNameMenberNum > 0) {
    appendedUserName = inputtedUserName + "_" + (sameNameMenberNum + 1);
  }

  console.log(appendedUserName);
}

const userNameList = ["abc", "123"];
const inputtedUserName = "abc";
formatNameAndEmitEvent(userNameList, inputtedUserName);
