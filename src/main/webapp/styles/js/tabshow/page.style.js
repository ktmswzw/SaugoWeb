function genPlace(b, e, i, d) {
    var f = e.substr(0, 2) == "my" ? e.substr(3, 2) : e;
    var l = $(window).height();
    var c = l - 300;
    var c = c > 150 ? c : 150;
    var d = d == 1 ? "in active" : "";
    var b = "<div id='" + b + "' role='tabpanel' class='tab-pane fade " + d + "'>";
    var a = '<div class="panel-body　list-group" style="height:' + c + 'px;overflow:auto">';
    var k = "";
    for (var g = 1; g <= i; g++) {
        if (g < 10) {
            var h = e.toLowerCase() + "_00" + g;
            var m = f + "0" + g
        }
        if (g >= 10 && g < 100) {
            var h = e.toLowerCase() + "_0" + g;
            var m = f + g
        }
        k += "<div style='position:relative;border-left:1px solid #ddd;border-bottom:1px solid #ddd;'><a class='list-group-item shifutip' href='#' id='" + h + "' data-toggle='tooltip' data-placement='right' style='max-width:297px;border:none;margin-bottom:0px;' title='" + m + "'></a></div>"
    }
    allStr = b + a + k + "</div></div>";
    return allStr
}
function loadStyle(a, e, d) {
    var c = d.substr(0, 2) == "my" ? d.substr(3, 2) : d;
    for (var b = 1; b <= a; b++) {
        if (b <= 9) {
            $("#" + d + "_00" + b).load(e + c + "_00" + b + ".html")
        } else {
            if (b <= 99) {
                $("#" + d + "_0" + b).load(e + c + "_0" + b + ".html")
            } else {
                $("#" + d + "_" + b).load(e + c + b + ".html")
            }
        }
    }
}
function loadShifuStyle() {
    titleStr = genPlace("navTitle", "T", 22);
    cardStr = genPlace("navCard", "C", 35);
    picStr = genPlace("navPic", "P", 20);
    otherStr = genPlace("navOther", "O", 30);
    markStr = genPlace("navMark", "M", 1);
    summerStr = genPlace("navSummer", "SUM", 7);
    childhoodStr = genPlace("navChildhood", "CHI", 6);
    graduationStr = genPlace("navGraduation", "GRA", 6);
    dragonStr = genPlace("navDragon", "DRA", 7);
    fatherStr = genPlace("navFather", "FAT", 6);
    signatureStr = genPlace("navSignature", "SIG", 6);
    newestStr = genPlace("navNewest", "NEW", 11, 1);
    document.getElementById("tab-content-style").innerHTML = titleStr + cardStr + picStr + otherStr + markStr + summerStr + childhoodStr + graduationStr + dragonStr + fatherStr + signatureStr + newestStr;
    loadStyle(11, "style/newest/", "new");
    runAppendCollection()
}
function loadMemberStyle(c, a, b) {
    addMemberFavCollection(c, a, b)
}
function shifuMouseDown(d) {
    var b = document.getElementById(d).outerHTML;
    var a = UE.getEditor("dr_content").selection.getRange();
    a.select();
    selectedText = UE.getEditor("dr_content").selection.getText();
    if (selectedText == null || selectedText == undefined || selectedText == "") {
        UE.getEditor("dr_content").execCommand("insertHtml", b);
        return
    } else {
        if (d == "shifu_t_001") {
            var c = b.replace("01", selectedText)
        } else {
            if (d == "shifu_t_002" || d == "shifu_t_003") {
                var c = b.replace("大标题", selectedText)
            } else {
                if (d == "shifu_t_004") {
                    var c = b.replace("请输入标题文字", selectedText)
                } else {
                    var c = b.replace("标题", selectedText)
                }
            }
        }
    }
    UE.getEditor("dr_content").execCommand("insertHtml", c)
}
function shifuMouseDownCard(d) {
    var b = document.getElementById(d).outerHTML;
    var a = UE.getEditor("dr_content").selection.getRange();
    a.select();
    selectedText = UE.getEditor("dr_content").selection.getText();
    if (selectedText == null || selectedText == undefined || selectedText == "") {
        UE.getEditor("dr_content").execCommand("insertHtml", b);
        return
    } else {
        var e = map.get(d);
        var c = b.replace(e, selectedText);
        UE.getEditor("dr_content").execCommand("insertHtml", c)
    }
}
function shifuMouseDownOther(c) {
    var a = document.getElementById(c).outerHTML;
    if (c == "shifu_o_007" || c == "shifu_o_008" || c == "shifu_o_009" || c == "shifu_o_014" || c == "shifu_o_015" || c == "shifu_o_016") {
        UE.getEditor("dr_content").execCommand("insertHtml", a)
    } else {
        var b = a.replace("230px;", "100%; ");
        UE.getEditor("dr_content").execCommand("insertHtml", b)
    }
}
function shifuMouseDownPic(c) {
    var a = document.getElementById(c).outerHTML;
    if (c == "shifu_p_001" || c == "shifu_p_002" || c == "shifu_p_003" || c == "shifu_p_004" || c == "shifu_p_005" || c == "shifu_p_006" || c == "shifu_p_007" || c == "shifu_p_008" || c == "shifu_p_009" || c == "shifu_p_009" || c == "shifu_p_010" || c == "shifu_p_011" || c == "shifu_p_012" || c == "shifu_p_013" || c == "shifu_p_014" || c == "shifu_p_016" || c == "shifu_p_017" || c == "shifu_p_018" || c == "shifu_p_019" || c == "shifu_p_020" || c == "shifu_p_021" || c == "shifu_p_022" || c == "shifu_p_023") {
        var b = a.replace("100%;", "320px;");
        UE.getEditor("dr_content").execCommand("insertHtml", b)
    } else {
        UE.getEditor("dr_content").execCommand("insertHtml", a)
    }
}
function shifuMouseDownMark(b) {
    var a = document.getElementById(b).innerHTML;
    UE.getEditor("dr_content").execCommand("insertHtml", a)
}
function shifuMouseDownWhite(b) {
    var a = document.getElementById(b).outerHTML;
    UE.getEditor("dr_content").execCommand("insertHtml", a)
}
function shifuMouseDownSpring(b) {
    var a = document.getElementById(b).outerHTML;
    UE.getEditor("dr_content").execCommand("insertHtml", a)
}
function shifuMouseDownSummer(d) {
    var b = document.getElementById(d).outerHTML;
    var a = UE.getEditor("dr_content").selection.getRange();
    a.select();
    selectedText = UE.getEditor("dr_content").selection.getText();
    var c;
    if (selectedText == null || selectedText == undefined || selectedText == "") {
        UE.getEditor("dr_content").execCommand("insertHtml", b);
        return
    } else {
        if (d == "shifu_sum_002") {
            var e = map.get(d);
            c = b.replace(e, selectedText);
            UE.getEditor("dr_content").execCommand("insertHtml", c)
        } else {
            if (d == "shifu_sum_003" || d == "shifu_sum_004" || d == "shifu_sum_005") {
                UE.getEditor("dr_content").execCommand("insertHtml", b)
            } else {
                c = b.replace("标题", selectedText);
                UE.getEditor("dr_content").execCommand("insertHtml", c)
            }
        }
    }
}
function shifuMouseDownChildhood(d) {
    var b = document.getElementById(d).outerHTML;
    var a = UE.getEditor("dr_content").selection.getRange();
    a.select();
    selectedText = UE.getEditor("dr_content").selection.getText();
    var c;
    if (selectedText == null || selectedText == undefined || selectedText == "") {
        UE.getEditor("dr_content").execCommand("insertHtml", b);
        return
    } else {
        if (d == "shifu_chi_002" || d == "shifu_chi_003") {
            var e = map.get(d);
            c = b.replace(e, selectedText);
            UE.getEditor("dr_content").execCommand("insertHtml", c)
        } else {
            if (d == "shifu_chi_004") {
                UE.getEditor("dr_content").execCommand("insertHtml", b)
            } else {
                c = b.replace("标题", selectedText);
                UE.getEditor("dr_content").execCommand("insertHtml", c)
            }
        }
    }
}
function shifuMouseDownGraduation(d) {
    var b = document.getElementById(d).outerHTML;
    var a = UE.getEditor("dr_content").selection.getRange();
    a.select();
    selectedText = UE.getEditor("dr_content").selection.getText();
    var c;
    if (selectedText == null || selectedText == undefined || selectedText == "") {
        UE.getEditor("dr_content").execCommand("insertHtml", b);
        return
    } else {
        if (d == "shifu_gra_005") {
            var e = map.get(d);
            c = b.replace(e, selectedText);
            UE.getEditor("dr_content").execCommand("insertHtml", c)
        } else {
            if (d == "shifu_gra_003" || d == "shifu_gra_006") {
                UE.getEditor("dr_content").execCommand("insertHtml", b)
            } else {
                c = b.replace("标题", selectedText);
                UE.getEditor("dr_content").execCommand("insertHtml", c)
            }
        }
    }
}
function shifuMouseDownDragon(d) {
    var b = document.getElementById(d).outerHTML;
    var a = UE.getEditor("dr_content").selection.getRange();
    a.select();
    selectedText = UE.getEditor("dr_content").selection.getText();
    var c;
    if (selectedText == null || selectedText == undefined || selectedText == "") {
        UE.getEditor("dr_content").execCommand("insertHtml", b);
        return
    } else {
        if (d == "shifu_dra_003" || d == "shifu_dra_007") {
            var e = map.get(d);
            c = b.replace(e, selectedText);
            UE.getEditor("dr_content").execCommand("insertHtml", c)
        } else {
            if (d == "shifu_dra_004" || d == "shifu_dra_005") {
                UE.getEditor("dr_content").execCommand("insertHtml", b)
            } else {
                c = b.replace("端午节", selectedText);
                UE.getEditor("dr_content").execCommand("insertHtml", c)
            }
        }
    }
}
function shifuMouseDownFather(d) {
    var b = document.getElementById(d).outerHTML;
    var a = UE.getEditor("dr_content").selection.getRange();
    a.select();
    selectedText = UE.getEditor("dr_content").selection.getText();
    var c;
    if (selectedText == null || selectedText == undefined || selectedText == "") {
        UE.getEditor("dr_content").execCommand("insertHtml", b);
        return
    } else {
        if (d == "shifu_fat_004" || d == "shifu_fat_005" || d == "shifu_fat_006") {
            var e = map.get(d);
            c = b.replace(e, selectedText);
            UE.getEditor("dr_content").execCommand("insertHtml", c)
        } else {
            if (d == "shifu_fat_003") {
                UE.getEditor("dr_content").execCommand("insertHtml", b)
            } else {
                c = b.replace("父亲节", selectedText);
                UE.getEditor("dr_content").execCommand("insertHtml", c)
            }
        }
    }
}
function shifuMouseDownSignature(b) {
    var a = document.getElementById(b).outerHTML;
    UE.getEditor("dr_content").execCommand("insertHtml", a)
}
function shifuMouseDownNewest(b) {
    var a = document.getElementById(b).outerHTML;
    UE.getEditor("dr_content").execCommand("insertHtml", a)
};