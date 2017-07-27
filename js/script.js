var chess = document.getElementById('chess');
var context = chess.getContext('2d');

var myWin = [];
var computerWin = [];
//先手为自己
var me = true;
var over = false;

// 将棋盘所有位置标记为0，表示开始时所有位置均未落子
var chessBoard = [];
for(var i=0; i<15; i++) {
    chessBoard[i] = [];
    for(var j=0; j<15; j++) {
        chessBoard[i][j] = 0;
    }
}

//赢法数组
var wins = [];
for (var i=0; i<15; i++) {
    wins[i] = [];
    for(var j=0; j<15; j++) {
        wins[i][j] = [];
    }
}

//赢法统计，count为赢法索引
var count = 0;

//所有横线式赢法
for (var i=0; i<15; i++) {
    for(var j=0; j<11; j++) {
        for(var k=0; k<5; k++) {
            wins[i][j+k][count] = true;
        }
        count++;
    }
    //第0种赢法为 win[0][0][0],win[0][1][0],win[0][2][0],win[0][3][0],win[0][4][0] 第n种以此类推
}

//所有竖线式赢法
for (var i=0; i<11; i++) {
    for(var j=0; j<15; j++) {
        for(var k=0; k<5; k++) {
            wins[i+k][j][count] = true;
        }
        count++;
    }
}

//所有正斜线式赢法
for (var i=0; i<11; i++) {
    for(var j=0; j<11; j++) {
        for(var k=0; k<5; k++) {
            wins[i+k][j+k][count] = true;
        }
        count++;
    }
}

//所有反斜线式赢法
for (var i=0; i<11; i++) {
    for(var j=14; j>3; j--) {
        for(var k=0; k<5; k++) {
            wins[i+k][j-k][count] = true;
        }
        count++;
    }
}



for(var i=0; i<count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}

//logo图片引入，等待图片加载完毕后开始绘制棋盘并执行落子操作
var logo = new Image();
logo.src = "images/logo.png";
logo.onload = function() {
    context.drawImage(logo,0,0,450,450);
    drawChessBoard();

}

// 定义棋盘线条颜色
context.strokeStyle = "#999";

//绘制棋盘
var drawChessBoard = function() {
    for(var i=0; i<15; i++){
        context.moveTo(15+i*30,15);
        context.lineTo(15+i*30,435);
        context.stroke();
        context.moveTo(15,15+i*30);
        context.lineTo(435,15+i*30);
        context.stroke();
    }
}

//绘制棋子
var oneStep = function(i, j, me) {
    context.beginPath();

    //绘制棋子轮廓
    context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI );
    context.closePath();
    //定义棋子渐变
    var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 -2, 13, 15 + i*30 + 2, 15 + j*30 -2, 0);
    //根据判断填充棋子颜色，若为me则填冲为黑子，反之为白子
    if(me){
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1,"#636766");
    } else {
        gradient.addColorStop(0, "#d1d1d1");
        gradient.addColorStop(1,"#f9f9f9");
    }
    context.fillStyle =  gradient;
    context.fill();

}

//落子实现
chess.onclick = function(e) {
    if(over) {
        return;
    }
    if(!me) {
        return;
    }
    //获取鼠标点击位置相对于棋盘的坐标
    var x = e.offsetX;
    var y = e.offsetY;
    //根据鼠标点击的坐标落子
    var i = Math.floor(x/30);
    var j = Math.floor(y/30);
    //根据标记，若为0则落子，并将我方落子位置标记为1，将对方落子位置标记为2。若不为0则不能落子
    if(chessBoard[i][j] ==0) {
        oneStep(i,j,me);

            chessBoard[i][j] = 1;




        for(var k=0; k<count; k++) {

                    if(wins[i][j][k]) {
                        myWin[k]++;
                        computerWin[k] = 6;
                        if(myWin[k] == 5) {
                            over = true;
                            window.alert("你赢了！");
                        }
                 }

        }
        if(!over) {
            me = !me;
            computerAI();
        }

    }
}

// AI算法实现
var computerAI = function () {
    //定义玩家评分
    var myScore = [];

    //定义机器人评分
    var computerScore = [];

    //定义最高分
    var max = 0;

    //最高分对应坐标缓存
    var u = 0;
    var v= 0;

    //初始化评分
    for(var i=0; i<15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for(var j=0; j<15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    //遍历棋盘，对所有未下子的坐标进行遍历
    for(var i=0; i<15; i++) {
        for(var j=0; j<15; j++){
            if(chessBoard[i][j]==0){
                for(var k=0; k<count; k++) {
    //分别计算出所有未下子坐标的玩家评分和AI评分
                    if(wins[i][j][k]){
                        if(myWin[k]==1){
                            myScore[i][j] += 200;
                        } else if(myWin[k]==2){
                            myScore[i][j] += 400;
                        } else if(myWin[k]==3){
                            myScore[i][j] += 2000;
                        } else if(myWin[k]==4){
                            myScore[i][j] += 10000;
                        }
                        if(computerWin[k]==1){
                            computerScore[i][j] += 220;
                        } else if(computerWin[k]==2){
                            computerScore[i][j] += 400;
                        } else if(computerWin[k]==3){
                            computerScore[i][j] += 2000;
                        } else if(computerWin[k]==4){
                            computerScore[i][j] += 10000;
                        }

                    }
                }
                if(myScore[i][j] > max) {
                    max = myScore[i][j];
                    u= i;
                    v=j;
                } else if (myScore[i][j]==max) {
                    if(computerScore[i][j]>computerScore[u][v]) {
                        u= i;
                        v=j;
                    }
                }
                if(computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u= i;
                    v=j;
                } else if (computerScore[i][j]==max) {
                    if(myScore[i][j]>myScore[u][v]) {
                        u= i;
                        v=j;
                    }
                }
            }
        }
    }
    oneStep(u,v,false);
    chessBoard[u][v] = 2;
    for(var k=0; k<count; k++) {
        if(me == false) {
            if(wins[u][v][k]) {
                computerWin[k]++;
                myWin[k] = 6;
                if(computerWin[k] == 5) {
                    over = true;
                    window.alert("计算机赢了！");
                }
            }
        }
    }
    if(!over) {
        me = !me
    }



}




