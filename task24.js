function addEvent(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}
function delegateEvent(element, tag, eventName, listener) {
            addEvent(element, eventName, function () {
                var event = arguments[0] || window.event,
                    target = event.target || event.srcElement;
                if (target && target.tagName === tag.toUpperCase()) {
                    listener.call(target, event);
                }
            })
        }
function $(id){
	return document.getElementById(id);
}

var buffer =[];
var root_node = document.getElementsByTagName("div")[0];
var levels = document.getElementsByTagName("div");
var insert_node = $("insert-btn");
var delete_node = $("delete-btn");
var timer = null;
var head = null;
var search = $("search");
var choose = $("choose");
var found = false;
var selectedDiv;
function reset(){
    var allDiv = document.getElementsByTagName('div');

    for (var i = 0; i < allDiv.length; i++) {
        allDiv[i].style.backgroundColor = '#fff';
    }
    if(buffer.length >0){
        head.style.backgroundColor = "#fff";//清除残留蓝色
        buffer = []; //清空队列
        clearTimeout(timer); //清除定时器
    }
}
function selectDiv(node_list){
    for(var i = 0;i<node_list.length;i++){
        addEvent(node_list[i],"click",function(e){
            reset();
            this.style.backgroundColor="#fef9d1";
            e.stopPropagation();//阻止事件冒泡
            selectedDiv = this;
        })
    }
}

function preDFS(node){
    var temp = null;
    reset();
    console.log(node.firstElementChild);
    (function DFS(node){
        var p = null;
        if(node !==null)
        {
            buffer.push(node);
            DFS(node.firstElementChild);
            if(node.firstElementChild){
                temp = node.firstElementChild.nextElementSibling;
                while(temp){
                    p = temp;
                    DFS(temp);
                    temp = p.nextElementSibling;
                }
            }
    }
    })(node);
    render();
}
function inDFS(node){
    var temp = null;
    reset();
    (function DFS(node){
        var p =null;
        if(node!==null){
            DFS(node.firstElementChild);
            buffer.push(node);
            if(node.firstElementChild){
                temp = node.firstElementChild.nextElementSibling;
                while(temp){
                    p = temp;
                    DFS(temp);
                    temp = p.nextElementSibling;
                }
            }
        }
    })(node);
    render();
}
function postDFS(node){
    var temp = null;
    reset();
    (function DFS(node){
        var p = null;
        if(node !== null){
            DFS(node.firstElementChild);
            if(node.firstElementChild){
                temp = node.firstElementChild.nextElementSibling;
                while(temp){
                    p=temp;
                    DFS(temp);
                    temp = p.nextElementSibling;
                }
            }
            buffer.push(node);
        }
    })(node);
    render();
}
function trim(str) {
            return str.replace(/^\s+|\s+$/g, "");
        }
function render() {
    if (search.value !== "") {
        searchShow();
    } else {
        onlyShow();
    }
}
function searchShow(){
    if(buffer.length ==0&& !found){
        alert("Not Found");
    }
    head = buffer.shift();
    if(head){
        text = head.firstChild.nodeValue;
        if(trim(text)==search.value){
            head.style.backgroundColor = "deeppink";
            found =true;
            alert("Founded");
            return;
        }else{
            head.style.backgroundColor = "#6fa3ff";//显示蓝色
            timer = setTimeout(function () {
            head.style.backgroundColor = "#fff";//1秒后节点的蓝色变为白色
            searchShow(); //递归调用show，使要显示的节点不停出队显示，直至为空
            }, 300);
        }
    }
}
function onlyShow(){
    head = buffer.shift(); //出队
    if (head) {
        head.style.backgroundColor = "#6fa3ff";//显示蓝色
        timer = setTimeout(function () {
            head.style.backgroundColor = "#fff";//1秒后节点的蓝色变为白色
            onlyShow(); //递归调用show，使要显示的节点不停出队显示，直至为空
        }, 300);
    }
}

delegateEvent(choose, "button", "click", function(){
    if(this.id === "preDFS"){
        preDFS(root_node);
    }else if(this.id === "inDFS"){
        inDFS(root_node);
    }else if(this.id === "postDFS"){
        postDFS(root_node);
    }
});
selectDiv(levels);
addEvent(delete_node,"click",function(e){
    if(selectedDiv == null){
        alert("请点击要删除的块");
        alert(selectedDiv);
    }else{
        var parent = selectedDiv.parentNode;
        parent.removeChild(selectedDiv);
    }
});
addEvent(insert_node,"click",function(e){
    var content = document.getElementById('insert-txt').value;
    if(content==" "){
        alert("please input the value");
    }else if(selectedDiv == undefined){
        alert("please select the box");
    }else{
        var newDiv = document.createElement("div");       
        newDiv.innerHTML = content + "<a class=\"display\" href=\"javascript:\;\">+</a>";
        selectedDiv.appendChild(newDiv);
        levels = document.getElementsByTagName("div");
        selectDiv(levels);
    }
});