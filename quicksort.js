//#region 캔버스에 화면 제어권 넘기기
var ctx
var canvas
    canvas = document.getElementById('quick');
    console.log(canvas)
    ctx = canvas.getContext('2d');
//#endregion

//#region 자료구조
// 기본 밑 바탕이 되는 배열
var indexer=50;                     //최대 크기보다 작은 실질적인 배열 크기
var array = new Array(50);          //크게 잡아서 그 안의 값으로 오류 없이 작동하게 유도함
                                    //그렇기에 null로 한번씩 초기화 해줌
                                    //array:가상의 sort할 수, B:array수를 통한 시각화, path:애니메이션 경로
for(var i=0;i<array.length;i++){    
    array[i]=null;
}
var B = new Array(50);
for(var i=0;i<B.length;i++){
    B[i]=null;
}
var path = new Array(1000)
for(var i=0;i<path.length;i++){
    path[i]=null
}

var pathcounter=0
var can_count=0

class Block{
    constructor(){
        this.xpos = 0;
        this.updown = 0;
        this.height = 0;
        this.state = 0;
    }

    draw(){
        if(this.state==0){ctx.fillStyle = "green";} 
        else if(this.state==1){ctx.fillStyle = "white";}
        else if(this.state==2) {ctx.fillStyle = "red";}
        this.ypos=140-this.height*5
        ctx.fillRect(this.xpos, 140-this.height*5+this.updown, 5, this.height*5);
    }
}
class SwapPath{
    constructor(){
        this.A = 0;
        this.B = 0;
        this.Pivot = 0;
    }
    fillpath(a,b,pivot){
        this.A=a
        this.B=b
        this.Pivot=pivot
    }
}
//#endregion

//#region 버튼 관련 함수 모음
var btn = document.getElementsByClassName('btn'); /*quick의 관련 버튼은 [0]*/

/* 배열의 배치를 랜덤적으로 바꾸는 버튼 */
btn[0].addEventListener('click', function(event){
    can_count=0
    for(var i=0;i<path.length;i++){
        path[i]=null
    }
    quick_btn_event();
});
function quick_btn_event(){
    var temp, tmp

    for(var i =0;i<array.length;i++){
        //0부터 num의 인덱스 끝까지 난수 생성
        tmp = Math.floor(Math.random()*((array.length-1)-0)+1)
        
        temp = array[i];
        array[i] = array[tmp];
        array[tmp] = temp;
    }

    console.log(array)

    for(var i=0;i<B.length;i++){
        B[i] = new Block()
        B[i].xpos = 8+ i*8;
        B[i].height = array[i];
        B[i].draw()
    }

    QuickSort(array, 0, array.length-1)
    console.log("퀵소트 완료")
    console.log(array)
    console.log("스왑 경로")
    console.log(path)
    

    // redering()
}


/* 배열의 수를 지정하는 버튼 */
btn[1].addEventListener('click', function(event){
    var inputString = prompt('18~22정도의 숫자를 입력하세요', '');
    var inputInt = parseInt(inputString);
    indexer=inputInt; 

    //처음에 50으로 지정했지만 new Array를 통해 indexer크기만큼 크기 변경함
    array = new Array(indexer)
    B = new Array(indexer)

    for(var i=0; i<B.length ; i++){ B[i]=null; }
    for(var i=0; i<array.length ; i++){ array[i]=i+1; }
});
//#endregion

//#region 퀵소트
function Swap(arr, a, b, pivot) // a,b 스왑 함수 
{
    var temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp

    if(a!=b){
        path[pathcounter] = new SwapPath()
        path[pathcounter].A = a
        path[pathcounter].B = b
        path[pathcounter].Pivot = pivot
        pathcounter++    
    }
}
function Partition(arr, left, right)
{
    var pivot = arr[left]; // 피벗의 위치는 가장 왼쪽에서 시작
    var low = left + 1;
    var high = right;

    
 
    while (low <= high) // 교차되기 전까지 반복한다 
    {
        while (low <= right && pivot >= arr[low]) // 피벗보다 큰 값을 찾는 과정 
        {
            low++; // low를 오른쪽으로 이동 
        }
        while (high >= (left+1)  && pivot <= arr[high]) // 피벗보다 작은 값을 찾는 과정 
        {
            high--; // high를 왼쪽으로 이동
        }
        if (low <= high)// 교차되지 않은 상태이면 스왑 과정 실행 
        {
            Swap(arr, low, high, left); //low와 high를 스왑 
        }
    }
    Swap(arr, left, high, left); // 피벗과 high가 가리키는 대상을 교환 
    return high;  // 옮겨진 피벗의 위치정보를 반환 
 
}
 
function QuickSort(arr, left, right)
{
    if (left <= right)
    {
        console.log("퀵소트의 피벗 선택")
        console.log(left)
        var pivot = Partition(arr, left, right); // 둘로 나누어서
        QuickSort(arr, left, pivot - 1); // 왼쪽 영역을 정렬한다.
        QuickSort(arr, pivot + 1, right); // 오른쪽 영역을 정렬한다.
    }
}
//#endregion

//#region 이벤트 루프
//목적지
var A_xpos, B_xpos
//각각의 벡터
var from_A_to_B, from_B_to_A
//클릭 시만 들어감
var click_onoffer=false
var A_stop = false, B_stop = false
var test
function update(){
    if(click_onoffer){

        //A에서B까지 B에서A까지 업데이트 한번 당 벡터만큼 이동함
        if(B[path[can_count].A].xpos<B_xpos){
            B[path[can_count].A].xpos=B[path[can_count].A].xpos + from_A_to_B
            B[path[can_count].A].updown=-10
        }
        else{ B[path[can_count].A].xpos=B_xpos; A_stop=true; B[path[can_count].A].updown=0 }

        if(B[path[can_count].B].xpos>A_xpos){
            B[path[can_count].B].xpos=B[path[can_count].B].xpos + from_B_to_A
            B[path[can_count].B].updown=-10
        } else{ B[path[can_count].B].xpos=A_xpos; B_stop=true; B[path[can_count].B].updown=0 }

        if(A_stop && B_stop){
            console.log("스왑 완료")
            B[path[can_count].A].state = 0
            B[path[can_count].B].state = 0
            click_onoffer=false
            A_stop=false
            B_stop=false
            test = B[path[can_count].A]
            B[path[can_count].A] = B[path[can_count].B]
            B[path[can_count].B] = test
            can_count++
        }

        if(path[can_count]==null){
            for(var i=0;i<B.length;i++){
                B[i].state = 1;
            }
            click_onoffer=false;
        }

    }
}

function redering(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i =0;i<B.length;i++){
        B[i].draw();
    }
    
}

function rederingloop(){
    update()
    redering()
}

setInterval(rederingloop,50);

canvas.addEventListener('click',function(event){
    console.log(can_count)
    B[path[can_count].A].state = 1
    B[path[can_count].B].state = 1
    B[path[can_count].Pivot].state = 2

    A_xpos = B[path[can_count].A].xpos
    B_xpos = B[path[can_count].B].xpos

    from_A_to_B= (B_xpos - A_xpos)/25
    from_B_to_A= (A_xpos - B_xpos)/25

    console.log("A_xpos "+A_xpos)
    console.log("B_xpos "+B_xpos)
    console.log("from_A_to_B "+from_A_to_B)
    console.log("from_B_to_A "+from_B_to_A)

    click_onoffer=true
});
//#endregion