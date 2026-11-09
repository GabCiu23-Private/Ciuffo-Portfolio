import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {randomUUID} from 'node:crypto';
const source=fs.readFileSync(new URL('../assets/js/analytics.js',import.meta.url),'utf8');
function setup(preference){
 const requests=[],nodes=new Map();
 function element(){return {children:[],style:{},setAttribute(){},appendChild(x){this.children.push(x);if(x.id)nodes.set(x.id,x);},remove(){nodes.delete(this.id);}};}
 const body=element(),footer=element();
 function storage(initial={}){const data=new Map(Object.entries(initial));return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
 const document={body,readyState:'complete',visibilityState:'visible',referrer:'https://search.example/path?email=secret@example.com',getElementById:id=>nodes.get(id),querySelector:()=>footer,createElement:element,addEventListener(){}};
 const window={addEventListener(){}};
 const localStorage=storage(preference?{'ciuffo-analytics-consent-v1':preference}:{});
 vm.runInNewContext(source,{window,document,navigator:{},localStorage,sessionStorage:storage(),crypto:{randomUUID},location:{pathname:'/'},innerWidth:1200,Date,URL,fetch:(url,options)=>{requests.push(JSON.parse(options.body));return Promise.resolve({status:200});}});
 return {requests,nodes,window,localStorage};
}
test('sends nothing before consent and stops on withdrawal',()=>{
 const s=setup();assert.equal(s.requests.length,0);
 s.nodes.get('analytics-consent').children[2].onclick();assert.equal(s.requests.length,1);
 assert.equal(s.requests[0].consent,true);assert.equal(s.requests[0].events[0].referrer,'https://search.example');
 assert.equal(JSON.stringify(s.requests).includes('secret@'),false);
 s.window.CiuffoAnalytics.preferences();s.nodes.get('analytics-consent').children[1].onclick();
 s.window.CiuffoAnalytics.track('page_view');assert.equal(s.requests.length,1);
 assert.equal(s.localStorage.getItem('ciuffo-analytics-visitor-v1'),null);
});
test('remembered refusal never starts collection',()=>{const s=setup('rejected');assert.equal(s.requests.length,0);assert.equal(s.nodes.size,0);});
