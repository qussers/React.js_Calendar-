/**
 * Created by izijia on 16/9/8.
 */
import React from 'react';
import './Calendar.css';
class CalendarHeader extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            year:this.props.year,
            month:this.props.month
        }
    }

    handleLeftClick = () => {
        var newMonth = parseInt(this.state.month) - 1;
        var year = this.state.year;
        if(newMonth < 1){
            year --;
            newMonth = 12;
        }
        this.setState({
            month:newMonth,
            year:year
        });
        this.props.updateFilter(year,newMonth); // 执行父组件回调函数，改变父组件状态值
    }
    handleRightClick = () => {
    var newMonth = parseInt(this.state.month) + 1;
    var year = this.state.year;
    if( newMonth > 12 ){
        year ++;
        newMonth = 1;
    }
    this.state.month = newMonth;
    this.state.year=year;
    this.setState(this.state);				//改变组件状态值，通过this.setState()，这里是更新年月状态值
    this.props.updateFilter(year,newMonth);// 执行父组件回调函数，改变父组件状态值
    }
    render(){
    return(
        <div className="headerborder">
            <p style={{"line-height":30}}>{this.state.month}月</p>
            <p>{this.state.year}年</p>
            <p className="triangle-left"   onClick={this.handleLeftClick}> </p>
            <p className="triangle-right" onClick={this.handleRightClick}> </p>
        </div>
    )
    }
}

class CalendarBody extends React.Component{

    getMonthDays(){
    //根据月份获取当前天数
    var year = this.props.year,
        month = this.props.month;
    var temp = new Date(year,month,0);
    return temp.getDate();
    }
    getFirstDayWeek =() => {
    //获取当月第一天是星期几
    var year = this.props.year,
        month = this.props.month;
    var dt = new Date(year+'/'+month+'/1');
    var Weekdays = dt.getDay();
    return Weekdays;
    }
    render(){
    var arry1 = [],arry2 = [];
    var getDays = this.getMonthDays(),
        FirstDayWeek = this.getFirstDayWeek(),
        curday = this.props.day ;
    for(var i = 0 ;i < FirstDayWeek; i++ ){
        arry1[i] = i;
    }
    for(var i = 0 ;i < getDays; i++ ){
        arry2[i] = (i+1);
    }
//
    var node1 = arry1.map(function(item){
        return <li className="Calendar_li"></li> // 这里不能加引号，因为要返回HTML标签，而不是html字符串，
    });
    var node2 = arry2.map(function(item){
        return (curday == item)?
            <li style={{"backgroundColor": "#eee"}}>
                <div>
                    {item}
                    <div className="money">
                        <span className="moneyFont"> 3022￥</span>
                    </div>

                </div>

            </li>:
            <li>
                <div>
                    {item}
                </div>

            </li>
    });
        return(
            <div>
                <div className="weekday">
                    <ol>
                        <li className="Calendar_li">SUN</li>
                        <li className="Calendar_li">MON</li>
                        <li className="Calendar_li">TUE</li>
                        <li className="Calendar_li">WED</li>
                        <li className="Calendar_li">THU</li>
                        <li className="Calendar_li">FRI</li>
                        <li className="Calendar_li">SAT</li>
                    </ol>
                    <div className="CalendarDay" ref="CalendarDay"><ol>{node1}{node2}</ol></div>
                </div>

            </div>
        )
    }
}

export default class Calendar extends React.Component{


    formatDate = (date,fmt, flag) => {
        /**
         * 对Date的扩展，将 Date 转化为指定格式的String
         * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * eg:
         * Utils.formatDate(new Date(),'yyyy-MM-dd') ==> 2014-03-02
         * Utils.formatDate(new Date(),'yyyy-MM-dd hh:mm') ==> 2014-03-02 05:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd HH:mm') ==> 2014-03-02 17:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
         * Utils.formatDate(new Date(),'yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
         * Utils.formatDate(new Date(),'yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
         * Utils.formatDate(new Date(),'yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
         */
        if(!date) return;
        var o = {
            "M+" : date.getMonth()+1, //月份
            "d+" : date.getDate(), //日
            "h+" : flag ? date.getHours() : (date.getHours()%12 == 0 ? 12 : date.getHours()%12), //小时
            "H+" : date.getHours(), //小时
            "m+" : date.getMinutes(), //分
            "s+" : date.getSeconds(), //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S" : date.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "\u65e5",
            "1" : "\u4e00",
            "2" : "\u4e8c",
            "3" : "\u4e09",
            "4" : "\u56db",
            "5" : "\u4e94",
            "6" : "\u516d"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[date.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }
    constructor(props){
        super(props);
        var newDate =  new Date();
        this.state = {
            year:this.formatDate(newDate,'yyyy'),
            month:parseInt(this.formatDate(newDate,'MM')),
            day:parseInt(this.formatDate(newDate,'dd'))
        };
    }
    handleFilterUpdate = (filterYear,filterMonth) => {
        this.setState({
            year: filterYear,
            month: filterMonth
        });
    }
    render(){
        return(
            <div className="calendarBorder">

                <CalendarHeader
                    year = {this.state.year}
                    month = {this.state.month}
                    updateFilter={this.handleFilterUpdate} />
                <CalendarBody
                    year = {this.state.year}
                    month = {this.state.month}
                    day = {this.state.day} />
            </div>
        )
    }

}