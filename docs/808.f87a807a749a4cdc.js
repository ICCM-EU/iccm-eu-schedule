"use strict";(self.webpackChunkiccm_eu_schedule=self.webpackChunkiccm_eu_schedule||[]).push([[808],{1808:(A,a,s)=>{s.r(a),s.d(a,{EventsModule:()=>U});var f=s(5736),c=s(2678),u=s(9300),p=s(9992),e=s(4650),h=s(9358),d=s(6895),m=s(4859),v=s(7676),b=s(7510),y=s(3238),g=s(433);let x=(()=>{class o{transform(t,n,i){return p.R.cropTextAfter(t,n,i)}}return o.\u0275fac=function(t){return new(t||o)},o.\u0275pipe=e.Yjl({name:"cropText",type:o,pure:!0}),o})();function C(o,r){if(1&o&&(e.TgZ(0,"mat-option",8),e._uU(1),e.qZA()),2&o){const t=r.$implicit;e.Udp("background-color",t.color.secondary),e.Q6J("value",t.name),e.xp6(1),e.hij(" ",t.name," ")}}function _(o,r){if(1&o&&(e.TgZ(0,"span",20),e._uU(1),e.qZA()),2&o){const t=e.oxw(2).$implicit;e.xp6(1),e.hij(" (",t.speaker,")")}}function w(o,r){if(1&o&&(e.TgZ(0,"div",21)(1,"div",22),e._uU(2),e.ALo(3,"cropText"),e.qZA()()),2&o){const t=e.oxw(2).$implicit;e.xp6(1),e.uIk("title",t.description),e.xp6(1),e.hij("",e.Dn7(3,2,t.description,120," ")," ")}}function T(o,r){if(1&o&&(e.TgZ(0,"div",14)(1,"div",15)(2,"span"),e._uU(3),e.ALo(4,"date"),e.qZA(),e.TgZ(5,"span",16),e._uU(6),e.qZA(),e.YNc(7,_,2,1,"span",17),e.TgZ(8,"span",18),e._uU(9),e.qZA()(),e.YNc(10,w,4,6,"div",19),e.qZA()),2&o){const t=e.oxw().$implicit,n=e.oxw();e.Udp("border-left-color",t.room.color.primary)("background-color",t.room.color.secondary),e.xp6(3),e.hij(" ",e.xi3(4,9,t.schedule,"EE., HH:mm"),":"),e.xp6(3),e.hij(" ",t.title,""),e.xp6(1),e.Q6J("ngIf",t.speaker),e.xp6(2),e.hij(" ",t.room.name,""),e.xp6(1),e.Q6J("ngIf",n.showDescriptions&&t.description)}}function O(o,r){if(1&o&&(e.ynx(0),e.YNc(1,T,11,12,"div",13),e.BQk()),2&o){const t=r.$implicit,n=e.oxw();e.xp6(1),e.Q6J("ngIf",(!n.onlyUpcoming||t.upcoming)&&(void 0===n.sds.filterByRoom||""==n.sds.filterByRoom||n.sds.filterByRoom==t.room.name))}}const E=[{path:"",component:(()=>{class o{constructor(t,n,i,l,Z){this.sds=t,this.renderer=n,this.router=i,this.activatedRoute=l,this.viewportScroller=Z,this.objName="events",this.timerDisplay={timerCssClass:"",timerString:""},this.toggleUpcoming(0!=this.sds.timerEvents.nextEvents.length),this.toggleDescriptions(!0),this.renderer.setStyle(document.body,"background-color","dimgray")}ngOnInit(){this.sds.eventsUpdated.subscribe(t=>{this.events=t}),this.sds.eventsUpdated.emit(this.sds.transformJsonToEventInterfaceArray(JSON.parse(localStorage[this.sds.ssIDs.getCacheName(this.objName)]||"[]"))),this.sds.byRoomUpdated.subscribe(t=>{void 0!==t&&(this.roomList=t)}),this.sds.byRoomUpdated.emit(this.sds.transformJsonToEventRoomInterfaceArray(JSON.parse(localStorage[this.sds.ssIDs.getCacheByRoomName(this.objName)]||"[]"))),this.sds.timerEventUpdated.subscribe(t=>{if(null!=t)for(const n of t){let i;n&&n.nextEvents&&n.nextEvents.forEach(l=>{l&&l.schedule&&(void 0===i||i.getTime()>l.schedule.getTime())&&(i=l.schedule)}),this.timerDisplay=p.R.getTimerDisplay(i,this.sds)}}),this.sds.timerEventUpdated.emit(this.sds.transformJsonToEventTimerInterfaceArray(JSON.parse(localStorage[this.sds.ssIDs.getCacheForNextEvent(this.objName)]||"[]"))),this.router.events.pipe((0,u.h)(t=>t instanceof c.Xs)).subscribe(t=>{this.viewportScroller.scrollToAnchor(t.anchor)}),this.sds.startTimer()}ngAfterViewInit(){this.activatedRoute.fragment.subscribe(t=>{const n=document.querySelector("#"+t);n&&n.scrollIntoView()})}refresh(){this.sds.triggerSheetDataUpdate(this.objName)}toggleUpcoming(t){void 0!==t&&"boolean"==typeof t&&(this.onlyUpcoming=!t),this.toggleName=this.onlyUpcoming?"Show Upcoming":"Show All",this.onlyUpcoming=!this.onlyUpcoming}toggleDescriptions(t){void 0!==t&&"boolean"==typeof t&&(this.showDescriptions=!t),this.toggleDescriptionsName=this.showDescriptions?"Show Descriptions":"Hide Descriptions",this.showDescriptions=!this.showDescriptions}updateFilter(t){this.sds.updateFilter(t,this.objName)}}return o.\u0275fac=function(t){return new(t||o)(e.Y36(h.m),e.Y36(e.Qsj),e.Y36(c.F0),e.Y36(c.gz),e.Y36(d.EM))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-events"]],decls:26,vars:18,consts:[[1,"container"],[1,"toprow"],[1,"toprow-label"],[1,"toprow-buttons"],["mat-raised-button","",3,"click"],["routerLink","/countdown","mat-raised-button","",1,"btn","btn-primary"],["routerLink","/schedule","mat-raised-button","",1,"btn","btn-primary"],["placeholder","All Rooms","name","roomFilter",3,"ngModel","selectionChange"],[3,"value"],[3,"background-color","value",4,"ngFor","ngForOf"],[3,"routerLink","fragment"],[1,"events-list"],[4,"ngFor","ngForOf"],["class","event room",3,"border-left-color","background-color",4,"ngIf"],[1,"event","room"],[1,"event-head-row"],[1,"event-title"],["class","event-speaker",4,"ngIf"],[1,"event-room"],["class","event-details-row",4,"ngIf"],[1,"event-speaker"],[1,"event-details-row"],[1,"event-description"]],template:function(t,n){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2),e._uU(3),e.qZA(),e.TgZ(4,"div",3)(5,"button",4),e.NdJ("click",function(){return n.refresh()}),e._uU(6,"Refresh Events"),e.qZA(),e.TgZ(7,"button",4),e.NdJ("click",function(){return n.toggleUpcoming()}),e._uU(8),e.qZA(),e.TgZ(9,"button",4),e.NdJ("click",function(){return n.toggleDescriptions()}),e._uU(10),e.qZA(),e.TgZ(11,"a",5),e._uU(12,"Countdown"),e.qZA(),e.TgZ(13,"a",6),e._uU(14,"Schedule"),e.qZA(),e.TgZ(15,"mat-form-field")(16,"mat-select",7),e.NdJ("selectionChange",function(l){return n.updateFilter(l.value)}),e.TgZ(17,"mat-option",8),e._uU(18,"All Rooms"),e.qZA(),e.YNc(19,C,2,4,"mat-option",9),e.qZA()()(),e.TgZ(20,"a",10)(21,"div"),e._uU(22),e.qZA()()(),e._UZ(23,"a"),e.TgZ(24,"div",11),e.YNc(25,O,2,1,"ng-container",12),e.qZA()()),2&t&&(e.xp6(3),e.Oqu(n.sds.eventsLabel),e.xp6(5),e.Oqu(n.toggleName),e.xp6(2),e.Oqu(n.toggleDescriptionsName),e.xp6(6),e.Udp("background-color","whitesmoke")("color","lightgrey"),e.Q6J("ngModel",n.sds.filterByRoom),e.xp6(3),e.Q6J("ngForOf",n.roomList),e.xp6(1),e.Q6J("routerLink",".")("fragment","eventList"),e.xp6(1),e.Gre("toprow-counter ",n.timerDisplay.timerCssClass,""),e.xp6(1),e.Oqu(n.timerDisplay.timerString),e.xp6(1),e.uIk("name","eventList")("id","eventList"),e.xp6(2),e.Q6J("ngForOf",n.events))},dependencies:[c.rH,d.sg,d.O5,m.zs,m.lW,v.KE,b.gD,y.ey,g.JJ,g.On,d.uU,x],styles:[".container[_ngcontent-%COMP%]{margin-top:0;margin-left:10px;margin-right:10px;padding-top:0}.toprow[_ngcontent-%COMP%]{font-family:Arial,Helvetica,sans-serif;margin:0;width:100%;min-width:300px}.toprow-label[_ngcontent-%COMP%]{display:inline-block;padding:3px;margin:9px;color:#f5f5f5}.toprow-buttons[_ngcontent-%COMP%]{display:inline-block}.toprow-counter[_ngcontent-%COMP%]{float:right;min-width:35ex;text-align:right;font-size:larger;padding:3px;margin:5px;display:block;background-color:#696969}.countdown-10s-uneven[_ngcontent-%COMP%]{border:4px;border-color:red;border-style:solid;background-color:#ff646480;color:#000}.countdown-10s-even[_ngcontent-%COMP%]{border:4px;border-color:red;border-style:dashed;background-color:#ff646480;color:#000}.countdown-30s[_ngcontent-%COMP%]{border:4px;border-color:#fff;border-style:solid;background-color:#ff9b00b3;color:#000}.countdown-1m[_ngcontent-%COMP%]{border:4px;border-color:#fff;border-style:solid;background-color:#ffcd0080;color:#000}.countdown-3m[_ngcontent-%COMP%]{border:4px;border-color:#fff;border-style:solid;background-color:#ffff004d;color:#000}.countdown-5m[_ngcontent-%COMP%]{border:4px;border-color:#fff;border-style:solid;background-color:#64ff641a;color:#000}.countdown-long[_ngcontent-%COMP%]{border:4px;border-color:#696969;border-style:solid;background-color:#696969;color:#f5f5f5}.events-list[_ngcontent-%COMP%]{font-size:xx-large}.event[_ngcontent-%COMP%]{border:1px;border-color:#d3d3d3;border-style:solid;margin:5px;padding:5px;min-width:300px!important;font-family:Arial,Helvetica,sans-serif;border-left-width:5px;border-left-color:#d3d3d3;border-left-style:solid;background:rgba(255,255,255,.1)}.event-title[_ngcontent-%COMP%]{font-weight:700}.event-room[_ngcontent-%COMP%]{float:right}.event-description[_ngcontent-%COMP%]{color:#787878;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:smaller}.room[_ngcontent-%COMP%]{border-left-width:5px;border-left-style:solid}.mat-button-base[_ngcontent-%COMP%]{background-color:#f5f5f5}button[_ngcontent-%COMP%], .mat-mini-fab[_ngcontent-%COMP%], .mat-raised-button[_ngcontent-%COMP%]{color:#e6e6e6de;background-color:#848484}.mat-form-field-appearance-legacy[_ngcontent-%COMP%]   .mat-form-field-wrapper[_ngcontent-%COMP%]{padding-top:0;padding-bottom:0}.mat-form-field[_ngcontent-%COMP%]{padding-left:9px;padding-right:9px}"]}),o})()}];let M=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[c.Bz.forChild(E),c.Bz]}),o})(),U=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[M,f.m]}),o})()}}]);