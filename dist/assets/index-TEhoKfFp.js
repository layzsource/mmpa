(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ir="165",th=0,hl=1,nh=2,ud=1,ih=2,qn=3,Fn=0,Qt=1,hn=2,Qn=0,ji=1,fl=2,pl=3,ml=4,sh=5,Ni=100,oh=101,ah=102,rh=103,lh=104,ch=200,dh=201,uh=202,hh=203,_r=204,Sr=205,fh=206,ph=207,mh=208,gh=209,xh=210,yh=211,vh=212,_h=213,Sh=214,Mh=0,bh=1,wh=2,ra=3,Eh=4,Ch=5,Th=6,Ah=7,hd=0,Rh=1,Ph=2,yi=0,Lh=1,Ih=2,Dh=3,Uh=4,Fh=5,Nh=6,Oh=7,fd=300,Is=301,Ds=302,Mr=303,br=304,Ma=306,wr=1e3,zi=1001,Er=1002,Ht=1003,Bh=1004,So=1005,Sn=1006,Da=1007,Vi=1008,_i=1009,kh=1010,zh=1011,la=1012,pd=1013,Us=1014,Jn=1015,qi=1016,md=1017,gd=1018,Fs=1020,Vh=35902,Hh=1021,Gh=1022,Un=1023,jh=1024,Wh=1025,Es=1026,Ns=1027,xd=1028,yd=1029,$h=1030,vd=1031,_d=1033,Ua=33776,Fa=33777,Na=33778,Oa=33779,gl=35840,xl=35841,yl=35842,vl=35843,_l=36196,Sl=37492,Ml=37496,bl=37808,wl=37809,El=37810,Cl=37811,Tl=37812,Al=37813,Rl=37814,Pl=37815,Ll=37816,Il=37817,Dl=37818,Ul=37819,Fl=37820,Nl=37821,Ba=36492,Ol=36494,Bl=36495,qh=36283,kl=36284,zl=36285,Vl=36286,Xh=3200,Yh=3201,Sd=0,Kh=1,fi="",Ln="srgb",Si="srgb-linear",Dr="display-p3",ba="display-p3-linear",ca="linear",St="srgb",da="rec709",ua="p3",es=7680,Hl=519,Jh=512,Zh=513,Qh=514,Md=515,ef=516,tf=517,nf=518,sf=519,Cr=35044,of=35048,Gl="300 es",Zn=2e3,ha=2001;class ks{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const o=s.indexOf(t);o!==-1&&s.splice(o,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let jl=1234567;const so=Math.PI/180,uo=180/Math.PI;function ei(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[i&255]+kt[i>>8&255]+kt[i>>16&255]+kt[i>>24&255]).toLowerCase()}function Wt(n,e,t){return Math.max(e,Math.min(t,n))}function Ur(n,e){return(n%e+e)%e}function af(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function rf(n,e,t){return n!==e?(t-n)/(e-n):0}function oo(n,e,t){return(1-t)*n+t*e}function lf(n,e,t,i){return oo(n,e,1-Math.exp(-t*i))}function cf(n,e=1){return e-Math.abs(Ur(n,e*2)-e)}function df(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function uf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function hf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function ff(n,e){return n+Math.random()*(e-n)}function pf(n){return n*(.5-Math.random())}function mf(n){n!==void 0&&(jl=n);let e=jl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function gf(n){return n*so}function xf(n){return n*uo}function yf(n){return(n&n-1)===0&&n!==0}function vf(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function _f(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Sf(n,e,t,i,s){const o=Math.cos,a=Math.sin,r=o(t/2),c=a(t/2),u=o((e+i)/2),l=a((e+i)/2),h=o((e-i)/2),f=a((e-i)/2),m=o((i-e)/2),x=a((i-e)/2);switch(s){case"XYX":n.set(r*l,c*h,c*f,r*u);break;case"YZY":n.set(c*f,r*l,c*h,r*u);break;case"ZXZ":n.set(c*h,c*f,r*l,r*u);break;case"XZX":n.set(r*l,c*x,c*m,r*u);break;case"YXY":n.set(c*m,r*l,c*x,r*u);break;case"ZYZ":n.set(c*x,c*m,r*l,r*u);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Mn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ct(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ho={DEG2RAD:so,RAD2DEG:uo,generateUUID:ei,clamp:Wt,euclideanModulo:Ur,mapLinear:af,inverseLerp:rf,lerp:oo,damp:lf,pingpong:cf,smoothstep:df,smootherstep:uf,randInt:hf,randFloat:ff,randFloatSpread:pf,seededRandom:mf,degToRad:gf,radToDeg:xf,isPowerOfTwo:yf,ceilPowerOfTwo:vf,floorPowerOfTwo:_f,setQuaternionFromProperEuler:Sf,normalize:ct,denormalize:Mn};class Ke{constructor(e=0,t=0){Ke.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Wt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),o=this.x-e.x,a=this.y-e.y;return this.x=o*i-a*s+e.x,this.y=o*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qe{constructor(e,t,i,s,o,a,r,c,u){Qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,o,a,r,c,u)}set(e,t,i,s,o,a,r,c,u){const l=this.elements;return l[0]=e,l[1]=s,l[2]=r,l[3]=t,l[4]=o,l[5]=c,l[6]=i,l[7]=a,l[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,o=this.elements,a=i[0],r=i[3],c=i[6],u=i[1],l=i[4],h=i[7],f=i[2],m=i[5],x=i[8],y=s[0],g=s[3],p=s[6],_=s[1],v=s[4],b=s[7],P=s[2],C=s[5],A=s[8];return o[0]=a*y+r*_+c*P,o[3]=a*g+r*v+c*C,o[6]=a*p+r*b+c*A,o[1]=u*y+l*_+h*P,o[4]=u*g+l*v+h*C,o[7]=u*p+l*b+h*A,o[2]=f*y+m*_+x*P,o[5]=f*g+m*v+x*C,o[8]=f*p+m*b+x*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],o=e[3],a=e[4],r=e[5],c=e[6],u=e[7],l=e[8];return t*a*l-t*r*u-i*o*l+i*r*c+s*o*u-s*a*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],o=e[3],a=e[4],r=e[5],c=e[6],u=e[7],l=e[8],h=l*a-r*u,f=r*c-l*o,m=u*o-a*c,x=t*h+i*f+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/x;return e[0]=h*y,e[1]=(s*u-l*i)*y,e[2]=(r*i-s*a)*y,e[3]=f*y,e[4]=(l*t-s*c)*y,e[5]=(s*o-r*t)*y,e[6]=m*y,e[7]=(i*c-u*t)*y,e[8]=(a*t-i*o)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,o,a,r){const c=Math.cos(o),u=Math.sin(o);return this.set(i*c,i*u,-i*(c*a+u*r)+a+e,-s*u,s*c,-s*(-u*a+c*r)+r+t,0,0,1),this}scale(e,t){return this.premultiply(ka.makeScale(e,t)),this}rotate(e){return this.premultiply(ka.makeRotation(-e)),this}translate(e,t){return this.premultiply(ka.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ka=new Qe;function bd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function fo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Mf(){const n=fo("canvas");return n.style.display="block",n}const Wl={};function Fr(n){n in Wl||(Wl[n]=!0,console.warn(n))}function bf(n,e,t){return new Promise(function(i,s){function o(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(o,t);break;default:i()}}setTimeout(o,t)})}const $l=new Qe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ql=new Qe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Mo={[Si]:{transfer:ca,primaries:da,toReference:n=>n,fromReference:n=>n},[Ln]:{transfer:St,primaries:da,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[ba]:{transfer:ca,primaries:ua,toReference:n=>n.applyMatrix3(ql),fromReference:n=>n.applyMatrix3($l)},[Dr]:{transfer:St,primaries:ua,toReference:n=>n.convertSRGBToLinear().applyMatrix3(ql),fromReference:n=>n.applyMatrix3($l).convertLinearToSRGB()}},wf=new Set([Si,ba]),dt={enabled:!0,_workingColorSpace:Si,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!wf.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=Mo[e].toReference,s=Mo[t].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Mo[n].primaries},getTransfer:function(n){return n===fi?ca:Mo[n].transfer}};function Cs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function za(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let ts;class Ef{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ts===void 0&&(ts=fo("canvas")),ts.width=e.width,ts.height=e.height;const i=ts.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=ts}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=Cs(o[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Cs(t[i]/255)*255):t[i]=Cs(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Cf=0;class wd{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=ei(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?o.push(Va(s[a].image)):o.push(Va(s[a]))}else o=Va(s);i.url=o}return t||(e.images[this.uuid]=i),i}}function Va(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ef.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Tf=0;class Ot extends ks{constructor(e=Ot.DEFAULT_IMAGE,t=Ot.DEFAULT_MAPPING,i=zi,s=zi,o=Sn,a=Vi,r=Un,c=_i,u=Ot.DEFAULT_ANISOTROPY,l=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=ei(),this.name="",this.source=new wd(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=u,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Ke(0,0),this.repeat=new Ke(1,1),this.center=new Ke(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==fd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case wr:e.x=e.x-Math.floor(e.x);break;case zi:e.x=e.x<0?0:1;break;case Er:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case wr:e.y=e.y-Math.floor(e.y);break;case zi:e.y=e.y<0?0:1;break;case Er:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=fd;Ot.DEFAULT_ANISOTROPY=1;class Nt{constructor(e=0,t=0,i=0,s=1){Nt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,o=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*o,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*o,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*o,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*o,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,o;const c=e.elements,u=c[0],l=c[4],h=c[8],f=c[1],m=c[5],x=c[9],y=c[2],g=c[6],p=c[10];if(Math.abs(l-f)<.01&&Math.abs(h-y)<.01&&Math.abs(x-g)<.01){if(Math.abs(l+f)<.1&&Math.abs(h+y)<.1&&Math.abs(x+g)<.1&&Math.abs(u+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(u+1)/2,b=(m+1)/2,P=(p+1)/2,C=(l+f)/4,A=(h+y)/4,F=(x+g)/4;return v>b&&v>P?v<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(v),s=C/i,o=A/i):b>P?b<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(b),i=C/s,o=F/s):P<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(P),i=A/o,s=F/o),this.set(i,s,o,t),this}let _=Math.sqrt((g-x)*(g-x)+(h-y)*(h-y)+(f-l)*(f-l));return Math.abs(_)<.001&&(_=1),this.x=(g-x)/_,this.y=(h-y)/_,this.z=(f-l)/_,this.w=Math.acos((u+m+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Af extends ks{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Nt(0,0,e,t),this.scissorTest=!1,this.viewport=new Nt(0,0,e,t);const s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const o=new Ot(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);o.flipY=!1,o.generateMipmaps=i.generateMipmaps,o.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let r=0;r<a;r++)this.textures[r]=o.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new wd(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wn extends Af{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Ed extends Ot{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Rf extends Ot{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=zi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zs{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,o,a,r){let c=i[s+0],u=i[s+1],l=i[s+2],h=i[s+3];const f=o[a+0],m=o[a+1],x=o[a+2],y=o[a+3];if(r===0){e[t+0]=c,e[t+1]=u,e[t+2]=l,e[t+3]=h;return}if(r===1){e[t+0]=f,e[t+1]=m,e[t+2]=x,e[t+3]=y;return}if(h!==y||c!==f||u!==m||l!==x){let g=1-r;const p=c*f+u*m+l*x+h*y,_=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const P=Math.sqrt(v),C=Math.atan2(P,p*_);g=Math.sin(g*C)/P,r=Math.sin(r*C)/P}const b=r*_;if(c=c*g+f*b,u=u*g+m*b,l=l*g+x*b,h=h*g+y*b,g===1-r){const P=1/Math.sqrt(c*c+u*u+l*l+h*h);c*=P,u*=P,l*=P,h*=P}}e[t]=c,e[t+1]=u,e[t+2]=l,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,o,a){const r=i[s],c=i[s+1],u=i[s+2],l=i[s+3],h=o[a],f=o[a+1],m=o[a+2],x=o[a+3];return e[t]=r*x+l*h+c*m-u*f,e[t+1]=c*x+l*f+u*h-r*m,e[t+2]=u*x+l*m+r*f-c*h,e[t+3]=l*x-r*h-c*f-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,o=e._z,a=e._order,r=Math.cos,c=Math.sin,u=r(i/2),l=r(s/2),h=r(o/2),f=c(i/2),m=c(s/2),x=c(o/2);switch(a){case"XYZ":this._x=f*l*h+u*m*x,this._y=u*m*h-f*l*x,this._z=u*l*x+f*m*h,this._w=u*l*h-f*m*x;break;case"YXZ":this._x=f*l*h+u*m*x,this._y=u*m*h-f*l*x,this._z=u*l*x-f*m*h,this._w=u*l*h+f*m*x;break;case"ZXY":this._x=f*l*h-u*m*x,this._y=u*m*h+f*l*x,this._z=u*l*x+f*m*h,this._w=u*l*h-f*m*x;break;case"ZYX":this._x=f*l*h-u*m*x,this._y=u*m*h+f*l*x,this._z=u*l*x-f*m*h,this._w=u*l*h+f*m*x;break;case"YZX":this._x=f*l*h+u*m*x,this._y=u*m*h+f*l*x,this._z=u*l*x-f*m*h,this._w=u*l*h-f*m*x;break;case"XZY":this._x=f*l*h-u*m*x,this._y=u*m*h-f*l*x,this._z=u*l*x+f*m*h,this._w=u*l*h+f*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],o=t[8],a=t[1],r=t[5],c=t[9],u=t[2],l=t[6],h=t[10],f=i+r+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(l-c)*m,this._y=(o-u)*m,this._z=(a-s)*m}else if(i>r&&i>h){const m=2*Math.sqrt(1+i-r-h);this._w=(l-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(o+u)/m}else if(r>h){const m=2*Math.sqrt(1+r-i-h);this._w=(o-u)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+l)/m}else{const m=2*Math.sqrt(1+h-i-r);this._w=(a-s)/m,this._x=(o+u)/m,this._y=(c+l)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Wt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,o=e._z,a=e._w,r=t._x,c=t._y,u=t._z,l=t._w;return this._x=i*l+a*r+s*u-o*c,this._y=s*l+a*c+o*r-i*u,this._z=o*l+a*u+i*c-s*r,this._w=a*l-i*r-s*c-o*u,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,o=this._z,a=this._w;let r=a*e._w+i*e._x+s*e._y+o*e._z;if(r<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,r=-r):this.copy(e),r>=1)return this._w=a,this._x=i,this._y=s,this._z=o,this;const c=1-r*r;if(c<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*o+t*this._z,this.normalize(),this}const u=Math.sqrt(c),l=Math.atan2(u,r),h=Math.sin((1-t)*l)/u,f=Math.sin(t*l)/u;return this._w=a*h+this._w*f,this._x=i*h+this._x*f,this._y=s*h+this._y*f,this._z=o*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),o=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),o*Math.sin(t),o*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,i=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Xl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Xl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,o=e.elements;return this.x=o[0]*t+o[3]*i+o[6]*s,this.y=o[1]*t+o[4]*i+o[7]*s,this.z=o[2]*t+o[5]*i+o[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,o=e.elements,a=1/(o[3]*t+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*t+o[4]*i+o[8]*s+o[12])*a,this.y=(o[1]*t+o[5]*i+o[9]*s+o[13])*a,this.z=(o[2]*t+o[6]*i+o[10]*s+o[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,o=e.x,a=e.y,r=e.z,c=e.w,u=2*(a*s-r*i),l=2*(r*t-o*s),h=2*(o*i-a*t);return this.x=t+c*u+a*h-r*l,this.y=i+c*l+r*u-o*h,this.z=s+c*h+o*l-a*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s,this.y=o[1]*t+o[5]*i+o[9]*s,this.z=o[2]*t+o[6]*i+o[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,o=e.z,a=t.x,r=t.y,c=t.z;return this.x=s*c-o*r,this.y=o*a-i*c,this.z=i*r-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ha.copy(this).projectOnVector(e),this.sub(Ha)}reflect(e){return this.sub(Ha.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Wt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ha=new U,Xl=new zs;class Mi{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const o=i.getAttribute("position");if(t===!0&&o!==void 0&&e.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)e.isMesh===!0?e.getVertexPosition(a,mn):mn.fromBufferAttribute(o,a),mn.applyMatrix4(e.matrixWorld),this.expandByPoint(mn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),bo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),bo.copy(i.boundingBox)),bo.applyMatrix4(e.matrixWorld),this.union(bo)}const s=e.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,mn),mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($s),wo.subVectors(this.max,$s),ns.subVectors(e.a,$s),is.subVectors(e.b,$s),ss.subVectors(e.c,$s),oi.subVectors(is,ns),ai.subVectors(ss,is),Ti.subVectors(ns,ss);let t=[0,-oi.z,oi.y,0,-ai.z,ai.y,0,-Ti.z,Ti.y,oi.z,0,-oi.x,ai.z,0,-ai.x,Ti.z,0,-Ti.x,-oi.y,oi.x,0,-ai.y,ai.x,0,-Ti.y,Ti.x,0];return!Ga(t,ns,is,ss,wo)||(t=[1,0,0,0,1,0,0,0,1],!Ga(t,ns,is,ss,wo))?!1:(Eo.crossVectors(oi,ai),t=[Eo.x,Eo.y,Eo.z],Ga(t,ns,is,ss,wo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Hn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Hn=[new U,new U,new U,new U,new U,new U,new U,new U],mn=new U,bo=new Mi,ns=new U,is=new U,ss=new U,oi=new U,ai=new U,Ti=new U,$s=new U,wo=new U,Eo=new U,Ai=new U;function Ga(n,e,t,i,s){for(let o=0,a=n.length-3;o<=a;o+=3){Ai.fromArray(n,o);const r=s.x*Math.abs(Ai.x)+s.y*Math.abs(Ai.y)+s.z*Math.abs(Ai.z),c=e.dot(Ai),u=t.dot(Ai),l=i.dot(Ai);if(Math.max(-Math.max(c,u,l),Math.min(c,u,l))>r)return!1}return!0}const Pf=new Mi,qs=new U,ja=new U;class Vs{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Pf.setFromPoints(e).getCenter(i);let s=0;for(let o=0,a=e.length;o<a;o++)s=Math.max(s,i.distanceToSquared(e[o]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;qs.subVectors(e,this.center);const t=qs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(qs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ja.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(qs.copy(e.center).add(ja)),this.expandByPoint(qs.copy(e.center).sub(ja))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Gn=new U,Wa=new U,Co=new U,ri=new U,$a=new U,To=new U,qa=new U;class Cd{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Gn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Gn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Gn.copy(this.origin).addScaledVector(this.direction,t),Gn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Wa.copy(e).add(t).multiplyScalar(.5),Co.copy(t).sub(e).normalize(),ri.copy(this.origin).sub(Wa);const o=e.distanceTo(t)*.5,a=-this.direction.dot(Co),r=ri.dot(this.direction),c=-ri.dot(Co),u=ri.lengthSq(),l=Math.abs(1-a*a);let h,f,m,x;if(l>0)if(h=a*c-r,f=a*r-c,x=o*l,h>=0)if(f>=-x)if(f<=x){const y=1/l;h*=y,f*=y,m=h*(h+a*f+2*r)+f*(a*h+f+2*c)+u}else f=o,h=Math.max(0,-(a*f+r)),m=-h*h+f*(f+2*c)+u;else f=-o,h=Math.max(0,-(a*f+r)),m=-h*h+f*(f+2*c)+u;else f<=-x?(h=Math.max(0,-(-a*o+r)),f=h>0?-o:Math.min(Math.max(-o,-c),o),m=-h*h+f*(f+2*c)+u):f<=x?(h=0,f=Math.min(Math.max(-o,-c),o),m=f*(f+2*c)+u):(h=Math.max(0,-(a*o+r)),f=h>0?o:Math.min(Math.max(-o,-c),o),m=-h*h+f*(f+2*c)+u);else f=a>0?-o:o,h=Math.max(0,-(a*f+r)),m=-h*h+f*(f+2*c)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Wa).addScaledVector(Co,f),m}intersectSphere(e,t){Gn.subVectors(e.center,this.origin);const i=Gn.dot(this.direction),s=Gn.dot(Gn)-i*i,o=e.radius*e.radius;if(s>o)return null;const a=Math.sqrt(o-s),r=i-a,c=i+a;return c<0?null:r<0?this.at(c,t):this.at(r,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,o,a,r,c;const u=1/this.direction.x,l=1/this.direction.y,h=1/this.direction.z,f=this.origin;return u>=0?(i=(e.min.x-f.x)*u,s=(e.max.x-f.x)*u):(i=(e.max.x-f.x)*u,s=(e.min.x-f.x)*u),l>=0?(o=(e.min.y-f.y)*l,a=(e.max.y-f.y)*l):(o=(e.max.y-f.y)*l,a=(e.min.y-f.y)*l),i>a||o>s||((o>i||isNaN(i))&&(i=o),(a<s||isNaN(s))&&(s=a),h>=0?(r=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(r=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),i>c||r>s)||((r>i||i!==i)&&(i=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Gn)!==null}intersectTriangle(e,t,i,s,o){$a.subVectors(t,e),To.subVectors(i,e),qa.crossVectors($a,To);let a=this.direction.dot(qa),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;ri.subVectors(this.origin,e);const c=r*this.direction.dot(To.crossVectors(ri,To));if(c<0)return null;const u=r*this.direction.dot($a.cross(ri));if(u<0||c+u>a)return null;const l=-r*ri.dot(qa);return l<0?null:this.at(l/a,o)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class gt{constructor(e,t,i,s,o,a,r,c,u,l,h,f,m,x,y,g){gt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,o,a,r,c,u,l,h,f,m,x,y,g)}set(e,t,i,s,o,a,r,c,u,l,h,f,m,x,y,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=o,p[5]=a,p[9]=r,p[13]=c,p[2]=u,p[6]=l,p[10]=h,p[14]=f,p[3]=m,p[7]=x,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new gt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/os.setFromMatrixColumn(e,0).length(),o=1/os.setFromMatrixColumn(e,1).length(),a=1/os.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*o,t[5]=i[5]*o,t[6]=i[6]*o,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,o=e.z,a=Math.cos(i),r=Math.sin(i),c=Math.cos(s),u=Math.sin(s),l=Math.cos(o),h=Math.sin(o);if(e.order==="XYZ"){const f=a*l,m=a*h,x=r*l,y=r*h;t[0]=c*l,t[4]=-c*h,t[8]=u,t[1]=m+x*u,t[5]=f-y*u,t[9]=-r*c,t[2]=y-f*u,t[6]=x+m*u,t[10]=a*c}else if(e.order==="YXZ"){const f=c*l,m=c*h,x=u*l,y=u*h;t[0]=f+y*r,t[4]=x*r-m,t[8]=a*u,t[1]=a*h,t[5]=a*l,t[9]=-r,t[2]=m*r-x,t[6]=y+f*r,t[10]=a*c}else if(e.order==="ZXY"){const f=c*l,m=c*h,x=u*l,y=u*h;t[0]=f-y*r,t[4]=-a*h,t[8]=x+m*r,t[1]=m+x*r,t[5]=a*l,t[9]=y-f*r,t[2]=-a*u,t[6]=r,t[10]=a*c}else if(e.order==="ZYX"){const f=a*l,m=a*h,x=r*l,y=r*h;t[0]=c*l,t[4]=x*u-m,t[8]=f*u+y,t[1]=c*h,t[5]=y*u+f,t[9]=m*u-x,t[2]=-u,t[6]=r*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,m=a*u,x=r*c,y=r*u;t[0]=c*l,t[4]=y-f*h,t[8]=x*h+m,t[1]=h,t[5]=a*l,t[9]=-r*l,t[2]=-u*l,t[6]=m*h+x,t[10]=f-y*h}else if(e.order==="XZY"){const f=a*c,m=a*u,x=r*c,y=r*u;t[0]=c*l,t[4]=-h,t[8]=u*l,t[1]=f*h+y,t[5]=a*l,t[9]=m*h-x,t[2]=x*h-m,t[6]=r*l,t[10]=y*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Lf,e,If)}lookAt(e,t,i){const s=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),li.crossVectors(i,nn),li.lengthSq()===0&&(Math.abs(i.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),li.crossVectors(i,nn)),li.normalize(),Ao.crossVectors(nn,li),s[0]=li.x,s[4]=Ao.x,s[8]=nn.x,s[1]=li.y,s[5]=Ao.y,s[9]=nn.y,s[2]=li.z,s[6]=Ao.z,s[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,o=this.elements,a=i[0],r=i[4],c=i[8],u=i[12],l=i[1],h=i[5],f=i[9],m=i[13],x=i[2],y=i[6],g=i[10],p=i[14],_=i[3],v=i[7],b=i[11],P=i[15],C=s[0],A=s[4],F=s[8],w=s[12],S=s[1],R=s[5],N=s[9],k=s[13],G=s[2],X=s[6],Y=s[10],J=s[14],V=s[3],ae=s[7],ce=s[11],ue=s[15];return o[0]=a*C+r*S+c*G+u*V,o[4]=a*A+r*R+c*X+u*ae,o[8]=a*F+r*N+c*Y+u*ce,o[12]=a*w+r*k+c*J+u*ue,o[1]=l*C+h*S+f*G+m*V,o[5]=l*A+h*R+f*X+m*ae,o[9]=l*F+h*N+f*Y+m*ce,o[13]=l*w+h*k+f*J+m*ue,o[2]=x*C+y*S+g*G+p*V,o[6]=x*A+y*R+g*X+p*ae,o[10]=x*F+y*N+g*Y+p*ce,o[14]=x*w+y*k+g*J+p*ue,o[3]=_*C+v*S+b*G+P*V,o[7]=_*A+v*R+b*X+P*ae,o[11]=_*F+v*N+b*Y+P*ce,o[15]=_*w+v*k+b*J+P*ue,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],o=e[12],a=e[1],r=e[5],c=e[9],u=e[13],l=e[2],h=e[6],f=e[10],m=e[14],x=e[3],y=e[7],g=e[11],p=e[15];return x*(+o*c*h-s*u*h-o*r*f+i*u*f+s*r*m-i*c*m)+y*(+t*c*m-t*u*f+o*a*f-s*a*m+s*u*l-o*c*l)+g*(+t*u*h-t*r*m-o*a*h+i*a*m+o*r*l-i*u*l)+p*(-s*r*l-t*c*h+t*r*f+s*a*h-i*a*f+i*c*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],o=e[3],a=e[4],r=e[5],c=e[6],u=e[7],l=e[8],h=e[9],f=e[10],m=e[11],x=e[12],y=e[13],g=e[14],p=e[15],_=h*g*u-y*f*u+y*c*m-r*g*m-h*c*p+r*f*p,v=x*f*u-l*g*u-x*c*m+a*g*m+l*c*p-a*f*p,b=l*y*u-x*h*u+x*r*m-a*y*m-l*r*p+a*h*p,P=x*h*c-l*y*c-x*r*f+a*y*f+l*r*g-a*h*g,C=t*_+i*v+s*b+o*P;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return e[0]=_*A,e[1]=(y*f*o-h*g*o-y*s*m+i*g*m+h*s*p-i*f*p)*A,e[2]=(r*g*o-y*c*o+y*s*u-i*g*u-r*s*p+i*c*p)*A,e[3]=(h*c*o-r*f*o-h*s*u+i*f*u+r*s*m-i*c*m)*A,e[4]=v*A,e[5]=(l*g*o-x*f*o+x*s*m-t*g*m-l*s*p+t*f*p)*A,e[6]=(x*c*o-a*g*o-x*s*u+t*g*u+a*s*p-t*c*p)*A,e[7]=(a*f*o-l*c*o+l*s*u-t*f*u-a*s*m+t*c*m)*A,e[8]=b*A,e[9]=(x*h*o-l*y*o-x*i*m+t*y*m+l*i*p-t*h*p)*A,e[10]=(a*y*o-x*r*o+x*i*u-t*y*u-a*i*p+t*r*p)*A,e[11]=(l*r*o-a*h*o-l*i*u+t*h*u+a*i*m-t*r*m)*A,e[12]=P*A,e[13]=(l*y*s-x*h*s+x*i*f-t*y*f-l*i*g+t*h*g)*A,e[14]=(x*r*s-a*y*s-x*i*c+t*y*c+a*i*g-t*r*g)*A,e[15]=(a*h*s-l*r*s+l*i*c-t*h*c-a*i*f+t*r*f)*A,this}scale(e){const t=this.elements,i=e.x,s=e.y,o=e.z;return t[0]*=i,t[4]*=s,t[8]*=o,t[1]*=i,t[5]*=s,t[9]*=o,t[2]*=i,t[6]*=s,t[10]*=o,t[3]*=i,t[7]*=s,t[11]*=o,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),o=1-i,a=e.x,r=e.y,c=e.z,u=o*a,l=o*r;return this.set(u*a+i,u*r-s*c,u*c+s*r,0,u*r+s*c,l*r+i,l*c-s*a,0,u*c-s*r,l*c+s*a,o*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,o,a){return this.set(1,i,o,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,o=t._x,a=t._y,r=t._z,c=t._w,u=o+o,l=a+a,h=r+r,f=o*u,m=o*l,x=o*h,y=a*l,g=a*h,p=r*h,_=c*u,v=c*l,b=c*h,P=i.x,C=i.y,A=i.z;return s[0]=(1-(y+p))*P,s[1]=(m+b)*P,s[2]=(x-v)*P,s[3]=0,s[4]=(m-b)*C,s[5]=(1-(f+p))*C,s[6]=(g+_)*C,s[7]=0,s[8]=(x+v)*A,s[9]=(g-_)*A,s[10]=(1-(f+y))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let o=os.set(s[0],s[1],s[2]).length();const a=os.set(s[4],s[5],s[6]).length(),r=os.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),e.x=s[12],e.y=s[13],e.z=s[14],gn.copy(this);const u=1/o,l=1/a,h=1/r;return gn.elements[0]*=u,gn.elements[1]*=u,gn.elements[2]*=u,gn.elements[4]*=l,gn.elements[5]*=l,gn.elements[6]*=l,gn.elements[8]*=h,gn.elements[9]*=h,gn.elements[10]*=h,t.setFromRotationMatrix(gn),i.x=o,i.y=a,i.z=r,this}makePerspective(e,t,i,s,o,a,r=Zn){const c=this.elements,u=2*o/(t-e),l=2*o/(i-s),h=(t+e)/(t-e),f=(i+s)/(i-s);let m,x;if(r===Zn)m=-(a+o)/(a-o),x=-2*a*o/(a-o);else if(r===ha)m=-a/(a-o),x=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=l,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,o,a,r=Zn){const c=this.elements,u=1/(t-e),l=1/(i-s),h=1/(a-o),f=(t+e)*u,m=(i+s)*l;let x,y;if(r===Zn)x=(a+o)*h,y=-2*h;else if(r===ha)x=o*h,y=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*u,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*l,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=y,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const os=new U,gn=new gt,Lf=new U(0,0,0),If=new U(1,1,1),li=new U,Ao=new U,nn=new U,Yl=new gt,Kl=new zs;class Nn{constructor(e=0,t=0,i=0,s=Nn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,o=s[0],a=s[4],r=s[8],c=s[1],u=s[5],l=s[9],h=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Wt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-l,m),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(f,u),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(r,m),this._z=Math.atan2(c,u)):(this._y=Math.atan2(-h,o),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,u)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-Wt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,u));break;case"YZX":this._z=Math.asin(Wt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,u),this._y=Math.atan2(-h,o)):(this._x=0,this._y=Math.atan2(r,m));break;case"XZY":this._z=Math.asin(-Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,u),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-l,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Yl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Yl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kl.setFromEuler(this),this.setFromQuaternion(Kl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Nn.DEFAULT_ORDER="XYZ";class Td{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Df=0;const Jl=new U,as=new zs,jn=new gt,Ro=new U,Xs=new U,Uf=new U,Ff=new zs,Zl=new U(1,0,0),Ql=new U(0,1,0),ec=new U(0,0,1),tc={type:"added"},Nf={type:"removed"},rs={type:"childadded",child:null},Xa={type:"childremoved",child:null};class Lt extends ks{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Lt.DEFAULT_UP.clone();const e=new U,t=new Nn,i=new zs,s=new U(1,1,1);function o(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(o),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new gt},normalMatrix:{value:new Qe}}),this.matrix=new gt,this.matrixWorld=new gt,this.matrixAutoUpdate=Lt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Td,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return as.setFromAxisAngle(e,t),this.quaternion.multiply(as),this}rotateOnWorldAxis(e,t){return as.setFromAxisAngle(e,t),this.quaternion.premultiply(as),this}rotateX(e){return this.rotateOnAxis(Zl,e)}rotateY(e){return this.rotateOnAxis(Ql,e)}rotateZ(e){return this.rotateOnAxis(ec,e)}translateOnAxis(e,t){return Jl.copy(e).applyQuaternion(this.quaternion),this.position.add(Jl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zl,e)}translateY(e){return this.translateOnAxis(Ql,e)}translateZ(e){return this.translateOnAxis(ec,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ro.copy(e):Ro.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(Xs,Ro,this.up):jn.lookAt(Ro,Xs,this.up),this.quaternion.setFromRotationMatrix(jn),s&&(jn.extractRotation(s.matrixWorld),as.setFromRotationMatrix(jn),this.quaternion.premultiply(as.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(tc),rs.child=e,this.dispatchEvent(rs),rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Nf),Xa.child=e,this.dispatchEvent(Xa),Xa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),jn.multiply(e.parent.matrixWorld)),e.applyMatrix4(jn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(tc),rs.child=e,this.dispatchEvent(rs),rs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,e,Uf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xs,Ff,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++){const o=t[i];(o.matrixWorldAutoUpdate===!0||e===!0)&&o.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++){const r=s[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(e.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let u=0,l=c.length;u<l;u++){const h=c[u];o(e.shapes,h)}else o(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,u=this.material.length;c<u;c++)r.push(o(e.materials,this.material[c]));s.material=r}else s.material=o(e.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(o(e.animations,c))}}if(t){const r=a(e.geometries),c=a(e.materials),u=a(e.textures),l=a(e.images),h=a(e.shapes),f=a(e.skeletons),m=a(e.animations),x=a(e.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),u.length>0&&(i.textures=u),l.length>0&&(i.images=l),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=s,i;function a(r){const c=[];for(const u in r){const l=r[u];delete l.metadata,c.push(l)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Lt.DEFAULT_UP=new U(0,1,0);Lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const xn=new U,Wn=new U,Ya=new U,$n=new U,ls=new U,cs=new U,nc=new U,Ka=new U,Ja=new U,Za=new U;class bn{constructor(e=new U,t=new U,i=new U){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),xn.subVectors(e,t),s.cross(xn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(e,t,i,s,o){xn.subVectors(s,t),Wn.subVectors(i,t),Ya.subVectors(e,t);const a=xn.dot(xn),r=xn.dot(Wn),c=xn.dot(Ya),u=Wn.dot(Wn),l=Wn.dot(Ya),h=a*u-r*r;if(h===0)return o.set(0,0,0),null;const f=1/h,m=(u*c-r*l)*f,x=(a*l-r*c)*f;return o.set(1-m-x,x,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,$n)===null?!1:$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getInterpolation(e,t,i,s,o,a,r,c){return this.getBarycoord(e,t,i,s,$n)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,$n.x),c.addScaledVector(a,$n.y),c.addScaledVector(r,$n.z),c)}static isFrontFacing(e,t,i,s){return xn.subVectors(i,t),Wn.subVectors(e,t),xn.cross(Wn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return xn.subVectors(this.c,this.b),Wn.subVectors(this.a,this.b),xn.cross(Wn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return bn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return bn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,o){return bn.getInterpolation(e,this.a,this.b,this.c,t,i,s,o)}containsPoint(e){return bn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return bn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,o=this.c;let a,r;ls.subVectors(s,i),cs.subVectors(o,i),Ka.subVectors(e,i);const c=ls.dot(Ka),u=cs.dot(Ka);if(c<=0&&u<=0)return t.copy(i);Ja.subVectors(e,s);const l=ls.dot(Ja),h=cs.dot(Ja);if(l>=0&&h<=l)return t.copy(s);const f=c*h-l*u;if(f<=0&&c>=0&&l<=0)return a=c/(c-l),t.copy(i).addScaledVector(ls,a);Za.subVectors(e,o);const m=ls.dot(Za),x=cs.dot(Za);if(x>=0&&m<=x)return t.copy(o);const y=m*u-c*x;if(y<=0&&u>=0&&x<=0)return r=u/(u-x),t.copy(i).addScaledVector(cs,r);const g=l*x-m*h;if(g<=0&&h-l>=0&&m-x>=0)return nc.subVectors(o,s),r=(h-l)/(h-l+(m-x)),t.copy(s).addScaledVector(nc,r);const p=1/(g+y+f);return a=y*p,r=f*p,t.copy(i).addScaledVector(ls,a).addScaledVector(cs,r)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ad={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ci={h:0,s:0,l:0},Po={h:0,s:0,l:0};function Qa(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class tt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=dt.workingColorSpace){return this.r=e,this.g=t,this.b=i,dt.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=dt.workingColorSpace){if(e=Ur(e,1),t=Wt(t,0,1),i=Wt(i,0,1),t===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+t):i+t-i*t,a=2*i-o;this.r=Qa(a,o,e+1/3),this.g=Qa(a,o,e),this.b=Qa(a,o,e-1/3)}return dt.toWorkingColorSpace(this,s),this}setStyle(e,t=Ln){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let o;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,t);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,t);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(o,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ln){const i=Ad[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Cs(e.r),this.g=Cs(e.g),this.b=Cs(e.b),this}copyLinearToSRGB(e){return this.r=za(e.r),this.g=za(e.g),this.b=za(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ln){return dt.fromWorkingColorSpace(zt.copy(this),e),Math.round(Wt(zt.r*255,0,255))*65536+Math.round(Wt(zt.g*255,0,255))*256+Math.round(Wt(zt.b*255,0,255))}getHexString(e=Ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.fromWorkingColorSpace(zt.copy(this),t);const i=zt.r,s=zt.g,o=zt.b,a=Math.max(i,s,o),r=Math.min(i,s,o);let c,u;const l=(r+a)/2;if(r===a)c=0,u=0;else{const h=a-r;switch(u=l<=.5?h/(a+r):h/(2-a-r),a){case i:c=(s-o)/h+(s<o?6:0);break;case s:c=(o-i)/h+2;break;case o:c=(i-s)/h+4;break}c/=6}return e.h=c,e.s=u,e.l=l,e}getRGB(e,t=dt.workingColorSpace){return dt.fromWorkingColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=Ln){dt.fromWorkingColorSpace(zt.copy(this),e);const t=zt.r,i=zt.g,s=zt.b;return e!==Ln?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ci),this.setHSL(ci.h+e,ci.s+t,ci.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ci),e.getHSL(Po);const i=oo(ci.h,Po.h,t),s=oo(ci.s,Po.s,t),o=oo(ci.l,Po.l,t);return this.setHSL(i,s,o),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,o=e.elements;return this.r=o[0]*t+o[3]*i+o[6]*s,this.g=o[1]*t+o[4]*i+o[7]*s,this.b=o[2]*t+o[5]*i+o[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zt=new tt;tt.NAMES=Ad;let Of=0;class Xi extends ks{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=ei(),this.name="",this.type="Material",this.blending=ji,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_r,this.blendDst=Sr,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=ra,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=es,this.stencilZFail=es,this.stencilZPass=es,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ji&&(i.blending=this.blending),this.side!==Fn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==_r&&(i.blendSrc=this.blendSrc),this.blendDst!==Sr&&(i.blendDst=this.blendDst),this.blendEquation!==Ni&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ra&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==es&&(i.stencilFail=this.stencilFail),this.stencilZFail!==es&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==es&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){const a=[];for(const r in o){const c=o[r];delete c.metadata,a.push(c)}return a}if(t){const o=s(e.textures),a=s(e.images);o.length>0&&(i.textures=o),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=t[o].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Yi extends Xi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=hd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new U,Lo=new Ke;class en{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Cr,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Jn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Fr("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Lo.fromBufferAttribute(this,t),Lo.applyMatrix3(e),this.setXY(t,Lo.x,Lo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Mn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ct(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Mn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Mn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Mn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Mn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),i=ct(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),i=ct(i,this.array),s=ct(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,o){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),i=ct(i,this.array),s=ct(s,this.array),o=ct(o,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=o,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Cr&&(e.usage=this.usage),e}}class Rd extends en{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Pd extends en{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class mt extends en{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Bf=0;const rn=new gt,er=new Lt,ds=new U,sn=new Mi,Ys=new Mi,Ut=new U;class Xt extends ks{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(bd(e)?Pd:Rd)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new Qe().getNormalMatrix(e);i.applyNormalMatrix(o),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return rn.makeRotationFromQuaternion(e),this.applyMatrix4(rn),this}rotateX(e){return rn.makeRotationX(e),this.applyMatrix4(rn),this}rotateY(e){return rn.makeRotationY(e),this.applyMatrix4(rn),this}rotateZ(e){return rn.makeRotationZ(e),this.applyMatrix4(rn),this}translate(e,t,i){return rn.makeTranslation(e,t,i),this.applyMatrix4(rn),this}scale(e,t,i){return rn.makeScale(e,t,i),this.applyMatrix4(rn),this}lookAt(e){return er.lookAt(e),er.updateMatrix(),this.applyMatrix4(er.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ds).negate(),this.translate(ds.x,ds.y,ds.z),this}setFromPoints(e){const t=[];for(let i=0,s=e.length;i<s;i++){const o=e[i];t.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new mt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const o=t[i];sn.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const i=this.boundingSphere.center;if(sn.setFromBufferAttribute(e),t)for(let o=0,a=t.length;o<a;o++){const r=t[o];Ys.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(sn.min,Ys.min),sn.expandByPoint(Ut),Ut.addVectors(sn.max,Ys.max),sn.expandByPoint(Ut)):(sn.expandByPoint(Ys.min),sn.expandByPoint(Ys.max))}sn.getCenter(i);let s=0;for(let o=0,a=e.count;o<a;o++)Ut.fromBufferAttribute(e,o),s=Math.max(s,i.distanceToSquared(Ut));if(t)for(let o=0,a=t.length;o<a;o++){const r=t[o],c=this.morphTargetsRelative;for(let u=0,l=r.count;u<l;u++)Ut.fromBufferAttribute(r,u),c&&(ds.fromBufferAttribute(e,u),Ut.add(ds)),s=Math.max(s,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,o=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new en(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),r=[],c=[];for(let F=0;F<i.count;F++)r[F]=new U,c[F]=new U;const u=new U,l=new U,h=new U,f=new Ke,m=new Ke,x=new Ke,y=new U,g=new U;function p(F,w,S){u.fromBufferAttribute(i,F),l.fromBufferAttribute(i,w),h.fromBufferAttribute(i,S),f.fromBufferAttribute(o,F),m.fromBufferAttribute(o,w),x.fromBufferAttribute(o,S),l.sub(u),h.sub(u),m.sub(f),x.sub(f);const R=1/(m.x*x.y-x.x*m.y);isFinite(R)&&(y.copy(l).multiplyScalar(x.y).addScaledVector(h,-m.y).multiplyScalar(R),g.copy(h).multiplyScalar(m.x).addScaledVector(l,-x.x).multiplyScalar(R),r[F].add(y),r[w].add(y),r[S].add(y),c[F].add(g),c[w].add(g),c[S].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let F=0,w=_.length;F<w;++F){const S=_[F],R=S.start,N=S.count;for(let k=R,G=R+N;k<G;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const v=new U,b=new U,P=new U,C=new U;function A(F){P.fromBufferAttribute(s,F),C.copy(P);const w=r[F];v.copy(w),v.sub(P.multiplyScalar(P.dot(w))).normalize(),b.crossVectors(C,w);const R=b.dot(c[F])<0?-1:1;a.setXYZW(F,v.x,v.y,v.z,R)}for(let F=0,w=_.length;F<w;++F){const S=_[F],R=S.start,N=S.count;for(let k=R,G=R+N;k<G;k+=3)A(e.getX(k+0)),A(e.getX(k+1)),A(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new en(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const s=new U,o=new U,a=new U,r=new U,c=new U,u=new U,l=new U,h=new U;if(e)for(let f=0,m=e.count;f<m;f+=3){const x=e.getX(f+0),y=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,x),o.fromBufferAttribute(t,y),a.fromBufferAttribute(t,g),l.subVectors(a,o),h.subVectors(s,o),l.cross(h),r.fromBufferAttribute(i,x),c.fromBufferAttribute(i,y),u.fromBufferAttribute(i,g),r.add(l),c.add(l),u.add(l),i.setXYZ(x,r.x,r.y,r.z),i.setXYZ(y,c.x,c.y,c.z),i.setXYZ(g,u.x,u.y,u.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),o.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),l.subVectors(a,o),h.subVectors(s,o),l.cross(h),i.setXYZ(f+0,l.x,l.y,l.z),i.setXYZ(f+1,l.x,l.y,l.z),i.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(r,c){const u=r.array,l=r.itemSize,h=r.normalized,f=new u.constructor(c.length*l);let m=0,x=0;for(let y=0,g=c.length;y<g;y++){r.isInterleavedBufferAttribute?m=c[y]*r.data.stride+r.offset:m=c[y]*l;for(let p=0;p<l;p++)f[x++]=u[m++]}return new en(f,l,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Xt,i=this.index.array,s=this.attributes;for(const r in s){const c=s[r],u=e(c,i);t.setAttribute(r,u)}const o=this.morphAttributes;for(const r in o){const c=[],u=o[r];for(let l=0,h=u.length;l<h;l++){const f=u[l],m=e(f,i);c.push(m)}t.morphAttributes[r]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const u=a[r];t.addGroup(u.start,u.count,u.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const u in c)c[u]!==void 0&&(e[u]=c[u]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const u=i[c];e.data.attributes[c]=u.toJSON(e.data)}const s={};let o=!1;for(const c in this.morphAttributes){const u=this.morphAttributes[c],l=[];for(let h=0,f=u.length;h<f;h++){const m=u[h];l.push(m.toJSON(e.data))}l.length>0&&(s[c]=l,o=!0)}o&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(e.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const s=e.attributes;for(const u in s){const l=s[u];this.setAttribute(u,l.clone(t))}const o=e.morphAttributes;for(const u in o){const l=[],h=o[u];for(let f=0,m=h.length;f<m;f++)l.push(h[f].clone(t));this.morphAttributes[u]=l}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let u=0,l=a.length;u<l;u++){const h=a[u];this.addGroup(h.start,h.count,h.materialIndex)}const r=e.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ic=new gt,Ri=new Cd,Io=new Vs,sc=new U,us=new U,hs=new U,fs=new U,tr=new U,Do=new U,Uo=new Ke,Fo=new Ke,No=new Ke,oc=new U,ac=new U,rc=new U,Oo=new U,Bo=new U;class Pt extends Lt{constructor(e=new Xt,t=new Yi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const r=this.morphTargetInfluences;if(o&&r){Do.set(0,0,0);for(let c=0,u=o.length;c<u;c++){const l=r[c],h=o[c];l!==0&&(tr.fromBufferAttribute(h,e),a?Do.addScaledVector(tr,l):Do.addScaledVector(tr.sub(t),l))}t.add(Do)}return t}raycast(e,t){const i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Io.copy(i.boundingSphere),Io.applyMatrix4(o),Ri.copy(e.ray).recast(e.near),!(Io.containsPoint(Ri.origin)===!1&&(Ri.intersectSphere(Io,sc)===null||Ri.origin.distanceToSquared(sc)>(e.far-e.near)**2))&&(ic.copy(o).invert(),Ri.copy(e.ray).applyMatrix4(ic),!(i.boundingBox!==null&&Ri.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ri)))}_computeIntersections(e,t,i){let s;const o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,u=o.attributes.uv,l=o.attributes.uv1,h=o.attributes.normal,f=o.groups,m=o.drawRange;if(r!==null)if(Array.isArray(a))for(let x=0,y=f.length;x<y;x++){const g=f[x],p=a[g.materialIndex],_=Math.max(g.start,m.start),v=Math.min(r.count,Math.min(g.start+g.count,m.start+m.count));for(let b=_,P=v;b<P;b+=3){const C=r.getX(b),A=r.getX(b+1),F=r.getX(b+2);s=ko(this,p,e,i,u,l,h,C,A,F),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),y=Math.min(r.count,m.start+m.count);for(let g=x,p=y;g<p;g+=3){const _=r.getX(g),v=r.getX(g+1),b=r.getX(g+2);s=ko(this,a,e,i,u,l,h,_,v,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,y=f.length;x<y;x++){const g=f[x],p=a[g.materialIndex],_=Math.max(g.start,m.start),v=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let b=_,P=v;b<P;b+=3){const C=b,A=b+1,F=b+2;s=ko(this,p,e,i,u,l,h,C,A,F),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const x=Math.max(0,m.start),y=Math.min(c.count,m.start+m.count);for(let g=x,p=y;g<p;g+=3){const _=g,v=g+1,b=g+2;s=ko(this,a,e,i,u,l,h,_,v,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function kf(n,e,t,i,s,o,a,r){let c;if(e.side===Qt?c=i.intersectTriangle(a,o,s,!0,r):c=i.intersectTriangle(s,o,a,e.side===Fn,r),c===null)return null;Bo.copy(r),Bo.applyMatrix4(n.matrixWorld);const u=t.ray.origin.distanceTo(Bo);return u<t.near||u>t.far?null:{distance:u,point:Bo.clone(),object:n}}function ko(n,e,t,i,s,o,a,r,c,u){n.getVertexPosition(r,us),n.getVertexPosition(c,hs),n.getVertexPosition(u,fs);const l=kf(n,e,t,i,us,hs,fs,Oo);if(l){s&&(Uo.fromBufferAttribute(s,r),Fo.fromBufferAttribute(s,c),No.fromBufferAttribute(s,u),l.uv=bn.getInterpolation(Oo,us,hs,fs,Uo,Fo,No,new Ke)),o&&(Uo.fromBufferAttribute(o,r),Fo.fromBufferAttribute(o,c),No.fromBufferAttribute(o,u),l.uv1=bn.getInterpolation(Oo,us,hs,fs,Uo,Fo,No,new Ke)),a&&(oc.fromBufferAttribute(a,r),ac.fromBufferAttribute(a,c),rc.fromBufferAttribute(a,u),l.normal=bn.getInterpolation(Oo,us,hs,fs,oc,ac,rc,new U),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));const h={a:r,b:c,c:u,normal:new U,materialIndex:0};bn.getNormal(us,hs,fs,h.normal),l.face=h}return l}class xo extends Xt{constructor(e=1,t=1,i=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:o,depthSegments:a};const r=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);const c=[],u=[],l=[],h=[];let f=0,m=0;x("z","y","x",-1,-1,i,t,e,a,o,0),x("z","y","x",1,-1,i,t,-e,a,o,1),x("x","z","y",1,1,e,i,t,s,a,2),x("x","z","y",1,-1,e,i,-t,s,a,3),x("x","y","z",1,-1,e,t,i,s,o,4),x("x","y","z",-1,-1,e,t,-i,s,o,5),this.setIndex(c),this.setAttribute("position",new mt(u,3)),this.setAttribute("normal",new mt(l,3)),this.setAttribute("uv",new mt(h,2));function x(y,g,p,_,v,b,P,C,A,F,w){const S=b/A,R=P/F,N=b/2,k=P/2,G=C/2,X=A+1,Y=F+1;let J=0,V=0;const ae=new U;for(let ce=0;ce<Y;ce++){const ue=ce*R-k;for(let Fe=0;Fe<X;Fe++){const He=Fe*S-N;ae[y]=He*_,ae[g]=ue*v,ae[p]=G,u.push(ae.x,ae.y,ae.z),ae[y]=0,ae[g]=0,ae[p]=C>0?1:-1,l.push(ae.x,ae.y,ae.z),h.push(Fe/A),h.push(1-ce/F),J+=1}}for(let ce=0;ce<F;ce++)for(let ue=0;ue<A;ue++){const Fe=f+ue+X*ce,He=f+ue+X*(ce+1),q=f+(ue+1)+X*(ce+1),te=f+(ue+1)+X*ce;c.push(Fe,He,te),c.push(He,q,te),V+=6}r.addGroup(m,V,w),m+=V,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Os(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function jt(n){const e={};for(let t=0;t<n.length;t++){const i=Os(n[t]);for(const s in i)e[s]=i[s]}return e}function zf(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ld(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}const Nr={clone:Os,merge:jt};var Vf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class fn extends Xi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vf,this.fragmentShader=Hf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=zf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Id extends Lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new gt,this.projectionMatrix=new gt,this.projectionMatrixInverse=new gt,this.coordinateSystem=Zn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const di=new U,lc=new Ke,cc=new Ke;class un extends Id{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=uo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(so*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return uo*2*Math.atan(Math.tan(so*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(di.x,di.y).multiplyScalar(-e/di.z),di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(di.x,di.y).multiplyScalar(-e/di.z)}getViewSize(e,t){return this.getViewBounds(e,lc,cc),t.subVectors(cc,lc)}setViewOffset(e,t,i,s,o,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(so*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,o=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,u=a.fullHeight;o+=a.offsetX*s/c,t-=a.offsetY*i/u,s*=a.width/c,i*=a.height/u}const r=this.filmOffset;r!==0&&(o+=e*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ps=-90,ms=1;class Gf extends Lt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new un(ps,ms,e,t);s.layers=this.layers,this.add(s);const o=new un(ps,ms,e,t);o.layers=this.layers,this.add(o);const a=new un(ps,ms,e,t);a.layers=this.layers,this.add(a);const r=new un(ps,ms,e,t);r.layers=this.layers,this.add(r);const c=new un(ps,ms,e,t);c.layers=this.layers,this.add(c);const u=new un(ps,ms,e,t);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,o,a,r,c]=t;for(const u of t)this.remove(u);if(e===Zn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ha)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of t)this.add(u),u.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,c,u,l]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,o),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,r),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,u),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,s),e.render(t,l),e.setRenderTarget(h,f,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class Dd extends Ot{constructor(e,t,i,s,o,a,r,c,u,l){e=e!==void 0?e:[],t=t!==void 0?t:Is,super(e,t,i,s,o,a,r,c,u,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class jf extends wn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Dd(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Sn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new xo(5,5,5),o=new fn({name:"CubemapFromEquirect",uniforms:Os(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Qt,blending:Qn});o.uniforms.tEquirect.value=t;const a=new Pt(s,o),r=t.minFilter;return t.minFilter===Vi&&(t.minFilter=Sn),new Gf(1,10,this).update(e,a),t.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,s){const o=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(o)}}const nr=new U,Wf=new U,$f=new Qe;class Di{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=nr.subVectors(i,t).cross(Wf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(nr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:t.copy(e.start).addScaledVector(i,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||$f.getNormalMatrix(e),s=this.coplanarPoint(nr).applyMatrix4(e),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Pi=new Vs,zo=new U;class Or{constructor(e=new Di,t=new Di,i=new Di,s=new Di,o=new Di,a=new Di){this.planes=[e,t,i,s,o,a]}set(e,t,i,s,o,a){const r=this.planes;return r[0].copy(e),r[1].copy(t),r[2].copy(i),r[3].copy(s),r[4].copy(o),r[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Zn){const i=this.planes,s=e.elements,o=s[0],a=s[1],r=s[2],c=s[3],u=s[4],l=s[5],h=s[6],f=s[7],m=s[8],x=s[9],y=s[10],g=s[11],p=s[12],_=s[13],v=s[14],b=s[15];if(i[0].setComponents(c-o,f-u,g-m,b-p).normalize(),i[1].setComponents(c+o,f+u,g+m,b+p).normalize(),i[2].setComponents(c+a,f+l,g+x,b+_).normalize(),i[3].setComponents(c-a,f-l,g-x,b-_).normalize(),i[4].setComponents(c-r,f-h,g-y,b-v).normalize(),t===Zn)i[5].setComponents(c+r,f+h,g+y,b+v).normalize();else if(t===ha)i[5].setComponents(r,h,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pi)}intersectsSprite(e){return Pi.center.set(0,0,0),Pi.radius=.7071067811865476,Pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pi)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let o=0;o<6;o++)if(t[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(zo.x=s.normal.x>0?e.max.x:e.min.x,zo.y=s.normal.y>0?e.max.y:e.min.y,zo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(zo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ud(){let n=null,e=!1,t=null,i=null;function s(o,a){t(o,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(o){t=o},setContext:function(o){n=o}}}function qf(n){const e=new WeakMap;function t(r,c){const u=r.array,l=r.usage,h=u.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,u,l),r.onUploadCallback();let m;if(u instanceof Float32Array)m=n.FLOAT;else if(u instanceof Uint16Array)r.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)m=n.SHORT;else if(u instanceof Uint32Array)m=n.UNSIGNED_INT;else if(u instanceof Int32Array)m=n.INT;else if(u instanceof Int8Array)m=n.BYTE;else if(u instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:f,type:m,bytesPerElement:u.BYTES_PER_ELEMENT,version:r.version,size:h}}function i(r,c,u){const l=c.array,h=c._updateRange,f=c.updateRanges;if(n.bindBuffer(u,r),h.count===-1&&f.length===0&&n.bufferSubData(u,0,l),f.length!==0){for(let m=0,x=f.length;m<x;m++){const y=f[m];n.bufferSubData(u,y.start*l.BYTES_PER_ELEMENT,l,y.start,y.count)}c.clearUpdateRanges()}h.count!==-1&&(n.bufferSubData(u,h.offset*l.BYTES_PER_ELEMENT,l,h.offset,h.count),h.count=-1),c.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),e.get(r)}function o(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=e.get(r);c&&(n.deleteBuffer(c.buffer),e.delete(r))}function a(r,c){if(r.isGLBufferAttribute){const l=e.get(r);(!l||l.version<r.version)&&e.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}r.isInterleavedBufferAttribute&&(r=r.data);const u=e.get(r);if(u===void 0)e.set(r,t(r,c));else if(u.version<r.version){if(u.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,r,c),u.version=r.version}}return{get:s,remove:o,update:a}}class bi extends Xt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const o=e/2,a=t/2,r=Math.floor(i),c=Math.floor(s),u=r+1,l=c+1,h=e/r,f=t/c,m=[],x=[],y=[],g=[];for(let p=0;p<l;p++){const _=p*f-a;for(let v=0;v<u;v++){const b=v*h-o;x.push(b,-_,0),y.push(0,0,1),g.push(v/r),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let _=0;_<r;_++){const v=_+u*p,b=_+u*(p+1),P=_+1+u*(p+1),C=_+1+u*p;m.push(v,b,C),m.push(b,P,C)}this.setIndex(m),this.setAttribute("position",new mt(x,3)),this.setAttribute("normal",new mt(y,3)),this.setAttribute("uv",new mt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bi(e.width,e.height,e.widthSegments,e.heightSegments)}}var Xf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Kf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ep=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,np=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ip=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,sp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,op=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ap=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,dp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,up=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,xp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,yp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,vp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,_p=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Sp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ep=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Cp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ap=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Rp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Lp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ip=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Up=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Fp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Np=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Op=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,zp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Vp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,$p=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,em=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,nm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,im=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,om=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,am=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,dm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,um=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,fm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,xm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ym=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_m=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,bm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Em=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Am=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,Pm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Lm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Im=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Um=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Fm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Om=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,km=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$m=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const qm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Km=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,eg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,tg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ng=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,sg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,og=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,lg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ug=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,pg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,yg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_g=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Mg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Eg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Cg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:Xf,alphahash_pars_fragment:Yf,alphamap_fragment:Kf,alphamap_pars_fragment:Jf,alphatest_fragment:Zf,alphatest_pars_fragment:Qf,aomap_fragment:ep,aomap_pars_fragment:tp,batching_pars_vertex:np,batching_vertex:ip,begin_vertex:sp,beginnormal_vertex:op,bsdfs:ap,iridescence_fragment:rp,bumpmap_pars_fragment:lp,clipping_planes_fragment:cp,clipping_planes_pars_fragment:dp,clipping_planes_pars_vertex:up,clipping_planes_vertex:hp,color_fragment:fp,color_pars_fragment:pp,color_pars_vertex:mp,color_vertex:gp,common:xp,cube_uv_reflection_fragment:yp,defaultnormal_vertex:vp,displacementmap_pars_vertex:_p,displacementmap_vertex:Sp,emissivemap_fragment:Mp,emissivemap_pars_fragment:bp,colorspace_fragment:wp,colorspace_pars_fragment:Ep,envmap_fragment:Cp,envmap_common_pars_fragment:Tp,envmap_pars_fragment:Ap,envmap_pars_vertex:Rp,envmap_physical_pars_fragment:zp,envmap_vertex:Pp,fog_vertex:Lp,fog_pars_vertex:Ip,fog_fragment:Dp,fog_pars_fragment:Up,gradientmap_pars_fragment:Fp,lightmap_pars_fragment:Np,lights_lambert_fragment:Op,lights_lambert_pars_fragment:Bp,lights_pars_begin:kp,lights_toon_fragment:Vp,lights_toon_pars_fragment:Hp,lights_phong_fragment:Gp,lights_phong_pars_fragment:jp,lights_physical_fragment:Wp,lights_physical_pars_fragment:$p,lights_fragment_begin:qp,lights_fragment_maps:Xp,lights_fragment_end:Yp,logdepthbuf_fragment:Kp,logdepthbuf_pars_fragment:Jp,logdepthbuf_pars_vertex:Zp,logdepthbuf_vertex:Qp,map_fragment:em,map_pars_fragment:tm,map_particle_fragment:nm,map_particle_pars_fragment:im,metalnessmap_fragment:sm,metalnessmap_pars_fragment:om,morphinstance_vertex:am,morphcolor_vertex:rm,morphnormal_vertex:lm,morphtarget_pars_vertex:cm,morphtarget_vertex:dm,normal_fragment_begin:um,normal_fragment_maps:hm,normal_pars_fragment:fm,normal_pars_vertex:pm,normal_vertex:mm,normalmap_pars_fragment:gm,clearcoat_normal_fragment_begin:xm,clearcoat_normal_fragment_maps:ym,clearcoat_pars_fragment:vm,iridescence_pars_fragment:_m,opaque_fragment:Sm,packing:Mm,premultiplied_alpha_fragment:bm,project_vertex:wm,dithering_fragment:Em,dithering_pars_fragment:Cm,roughnessmap_fragment:Tm,roughnessmap_pars_fragment:Am,shadowmap_pars_fragment:Rm,shadowmap_pars_vertex:Pm,shadowmap_vertex:Lm,shadowmask_pars_fragment:Im,skinbase_vertex:Dm,skinning_pars_vertex:Um,skinning_vertex:Fm,skinnormal_vertex:Nm,specularmap_fragment:Om,specularmap_pars_fragment:Bm,tonemapping_fragment:km,tonemapping_pars_fragment:zm,transmission_fragment:Vm,transmission_pars_fragment:Hm,uv_pars_fragment:Gm,uv_pars_vertex:jm,uv_vertex:Wm,worldpos_vertex:$m,background_vert:qm,background_frag:Xm,backgroundCube_vert:Ym,backgroundCube_frag:Km,cube_vert:Jm,cube_frag:Zm,depth_vert:Qm,depth_frag:eg,distanceRGBA_vert:tg,distanceRGBA_frag:ng,equirect_vert:ig,equirect_frag:sg,linedashed_vert:og,linedashed_frag:ag,meshbasic_vert:rg,meshbasic_frag:lg,meshlambert_vert:cg,meshlambert_frag:dg,meshmatcap_vert:ug,meshmatcap_frag:hg,meshnormal_vert:fg,meshnormal_frag:pg,meshphong_vert:mg,meshphong_frag:gg,meshphysical_vert:xg,meshphysical_frag:yg,meshtoon_vert:vg,meshtoon_frag:_g,points_vert:Sg,points_frag:Mg,shadow_vert:bg,shadow_frag:wg,sprite_vert:Eg,sprite_frag:Cg},xe={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},envMapRotation:{value:new Qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new Ke(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new Ke(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},In={basic:{uniforms:jt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:jt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new tt(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:jt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:jt([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:jt([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new tt(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:jt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:jt([xe.points,xe.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:jt([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:jt([xe.common,xe.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:jt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:jt([xe.sprite,xe.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qe}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:jt([xe.common,xe.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:jt([xe.lights,xe.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};In.physical={uniforms:jt([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new Ke(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new Ke},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new Ke},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const Vo={r:0,b:0,g:0},Li=new Nn,Tg=new gt;function Ag(n,e,t,i,s,o,a){const r=new tt(0);let c=o===!0?0:1,u,l,h=null,f=0,m=null;function x(_){let v=_.isScene===!0?_.background:null;return v&&v.isTexture&&(v=(_.backgroundBlurriness>0?t:e).get(v)),v}function y(_){let v=!1;const b=x(_);b===null?p(r,c):b&&b.isColor&&(p(b,1),v=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(_,v){const b=x(v);b&&(b.isCubeTexture||b.mapping===Ma)?(l===void 0&&(l=new Pt(new xo(1,1,1),new fn({name:"BackgroundCubeMaterial",uniforms:Os(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:Qt,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(P,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(l)),Li.copy(v.backgroundRotation),Li.x*=-1,Li.y*=-1,Li.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Li.y*=-1,Li.z*=-1),l.material.uniforms.envMap.value=b,l.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Tg.makeRotationFromEuler(Li)),l.material.toneMapped=dt.getTransfer(b.colorSpace)!==St,(h!==b||f!==b.version||m!==n.toneMapping)&&(l.material.needsUpdate=!0,h=b,f=b.version,m=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null)):b&&b.isTexture&&(u===void 0&&(u=new Pt(new bi(2,2),new fn({name:"BackgroundMaterial",uniforms:Os(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(u)),u.material.uniforms.t2D.value=b,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.toneMapped=dt.getTransfer(b.colorSpace)!==St,b.matrixAutoUpdate===!0&&b.updateMatrix(),u.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||f!==b.version||m!==n.toneMapping)&&(u.material.needsUpdate=!0,h=b,f=b.version,m=n.toneMapping),u.layers.enableAll(),_.unshift(u,u.geometry,u.material,0,0,null))}function p(_,v){_.getRGB(Vo,Ld(n)),i.buffers.color.setClear(Vo.r,Vo.g,Vo.b,v,a)}return{getClearColor:function(){return r},setClearColor:function(_,v=1){r.set(_),c=v,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,p(r,c)},render:y,addToRenderList:g}}function Rg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let o=s,a=!1;function r(S,R,N,k,G){let X=!1;const Y=h(k,N,R);o!==Y&&(o=Y,u(o.object)),X=m(S,k,N,G),X&&x(S,k,N,G),G!==null&&e.update(G,n.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,b(S,R,N,k),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function c(){return n.createVertexArray()}function u(S){return n.bindVertexArray(S)}function l(S){return n.deleteVertexArray(S)}function h(S,R,N){const k=N.wireframe===!0;let G=i[S.id];G===void 0&&(G={},i[S.id]=G);let X=G[R.id];X===void 0&&(X={},G[R.id]=X);let Y=X[k];return Y===void 0&&(Y=f(c()),X[k]=Y),Y}function f(S){const R=[],N=[],k=[];for(let G=0;G<t;G++)R[G]=0,N[G]=0,k[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:N,attributeDivisors:k,object:S,attributes:{},index:null}}function m(S,R,N,k){const G=o.attributes,X=R.attributes;let Y=0;const J=N.getAttributes();for(const V in J)if(J[V].location>=0){const ce=G[V];let ue=X[V];if(ue===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(ue=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(ue=S.instanceColor)),ce===void 0||ce.attribute!==ue||ue&&ce.data!==ue.data)return!0;Y++}return o.attributesNum!==Y||o.index!==k}function x(S,R,N,k){const G={},X=R.attributes;let Y=0;const J=N.getAttributes();for(const V in J)if(J[V].location>=0){let ce=X[V];ce===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(ce=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(ce=S.instanceColor));const ue={};ue.attribute=ce,ce&&ce.data&&(ue.data=ce.data),G[V]=ue,Y++}o.attributes=G,o.attributesNum=Y,o.index=k}function y(){const S=o.newAttributes;for(let R=0,N=S.length;R<N;R++)S[R]=0}function g(S){p(S,0)}function p(S,R){const N=o.newAttributes,k=o.enabledAttributes,G=o.attributeDivisors;N[S]=1,k[S]===0&&(n.enableVertexAttribArray(S),k[S]=1),G[S]!==R&&(n.vertexAttribDivisor(S,R),G[S]=R)}function _(){const S=o.newAttributes,R=o.enabledAttributes;for(let N=0,k=R.length;N<k;N++)R[N]!==S[N]&&(n.disableVertexAttribArray(N),R[N]=0)}function v(S,R,N,k,G,X,Y){Y===!0?n.vertexAttribIPointer(S,R,N,G,X):n.vertexAttribPointer(S,R,N,k,G,X)}function b(S,R,N,k){y();const G=k.attributes,X=N.getAttributes(),Y=R.defaultAttributeValues;for(const J in X){const V=X[J];if(V.location>=0){let ae=G[J];if(ae===void 0&&(J==="instanceMatrix"&&S.instanceMatrix&&(ae=S.instanceMatrix),J==="instanceColor"&&S.instanceColor&&(ae=S.instanceColor)),ae!==void 0){const ce=ae.normalized,ue=ae.itemSize,Fe=e.get(ae);if(Fe===void 0)continue;const He=Fe.buffer,q=Fe.type,te=Fe.bytesPerElement,re=q===n.INT||q===n.UNSIGNED_INT||ae.gpuType===pd;if(ae.isInterleavedBufferAttribute){const O=ae.data,fe=O.stride,Me=ae.offset;if(O.isInstancedInterleavedBuffer){for(let Ie=0;Ie<V.locationSize;Ie++)p(V.location+Ie,O.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let Ie=0;Ie<V.locationSize;Ie++)g(V.location+Ie);n.bindBuffer(n.ARRAY_BUFFER,He);for(let Ie=0;Ie<V.locationSize;Ie++)v(V.location+Ie,ue/V.locationSize,q,ce,fe*te,(Me+ue/V.locationSize*Ie)*te,re)}else{if(ae.isInstancedBufferAttribute){for(let O=0;O<V.locationSize;O++)p(V.location+O,ae.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let O=0;O<V.locationSize;O++)g(V.location+O);n.bindBuffer(n.ARRAY_BUFFER,He);for(let O=0;O<V.locationSize;O++)v(V.location+O,ue/V.locationSize,q,ce,ue*te,ue/V.locationSize*O*te,re)}}else if(Y!==void 0){const ce=Y[J];if(ce!==void 0)switch(ce.length){case 2:n.vertexAttrib2fv(V.location,ce);break;case 3:n.vertexAttrib3fv(V.location,ce);break;case 4:n.vertexAttrib4fv(V.location,ce);break;default:n.vertexAttrib1fv(V.location,ce)}}}}_()}function P(){F();for(const S in i){const R=i[S];for(const N in R){const k=R[N];for(const G in k)l(k[G].object),delete k[G];delete R[N]}delete i[S]}}function C(S){if(i[S.id]===void 0)return;const R=i[S.id];for(const N in R){const k=R[N];for(const G in k)l(k[G].object),delete k[G];delete R[N]}delete i[S.id]}function A(S){for(const R in i){const N=i[R];if(N[S.id]===void 0)continue;const k=N[S.id];for(const G in k)l(k[G].object),delete k[G];delete N[S.id]}}function F(){w(),a=!0,o!==s&&(o=s,u(o.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:F,resetDefaultState:w,dispose:P,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:y,enableAttribute:g,disableUnusedAttributes:_}}function Pg(n,e,t){let i;function s(u){i=u}function o(u,l){n.drawArrays(i,u,l),t.update(l,i,1)}function a(u,l,h){h!==0&&(n.drawArraysInstanced(i,u,l,h),t.update(l,i,h))}function r(u,l,h){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<h;m++)this.render(u[m],l[m]);else{f.multiDrawArraysWEBGL(i,u,0,l,0,h);let m=0;for(let x=0;x<h;x++)m+=l[x];t.update(m,i,1)}}function c(u,l,h,f){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<u.length;x++)a(u[x],l[x],f[x]);else{m.multiDrawArraysInstancedWEBGL(i,u,0,l,0,f,0,h);let x=0;for(let y=0;y<h;y++)x+=l[y];for(let y=0;y<f.length;y++)t.update(x,i,f[y])}}this.setMode=s,this.render=o,this.renderInstances=a,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function Lg(n,e,t,i){let s;function o(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==Un&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(C){const A=C===qi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==_i&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Jn&&!A)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=t.precision!==void 0?t.precision:"highp";const l=c(u);l!==u&&(console.warn("THREE.WebGLRenderer:",u,"not supported, using",l,"instead."),u=l);const h=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),y=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),p=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=m>0,P=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:r,precision:u,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:y,maxAttributes:g,maxVertexUniforms:p,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:b,maxSamples:P}}function Ig(n){const e=this;let t=null,i=0,s=!1,o=!1;const a=new Di,r=new Qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||i!==0||s;return s=f,i=h.length,m},this.beginShadows=function(){o=!0,l(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(h,f){t=l(h,f,0)},this.setState=function(h,f,m){const x=h.clippingPlanes,y=h.clipIntersection,g=h.clipShadows,p=n.get(h);if(!s||x===null||x.length===0||o&&!g)o?l(null):u();else{const _=o?0:i,v=_*4;let b=p.clippingState||null;c.value=b,b=l(x,f,v,m);for(let P=0;P!==v;++P)b[P]=t[P];p.clippingState=b,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=_}};function u(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function l(h,f,m,x){const y=h!==null?h.length:0;let g=null;if(y!==0){if(g=c.value,x!==!0||g===null){const p=m+y*4,_=f.matrixWorldInverse;r.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let v=0,b=m;v!==y;++v,b+=4)a.copy(h[v]).applyMatrix4(_,r),a.normal.toArray(g,b),g[b+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,g}}function Dg(n){let e=new WeakMap;function t(a,r){return r===Mr?a.mapping=Is:r===br&&(a.mapping=Ds),a}function i(a){if(a&&a.isTexture){const r=a.mapping;if(r===Mr||r===br)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const u=new jf(c.height);return u.fromEquirectangularTexture(n,a),e.set(a,u),a.addEventListener("dispose",s),t(u.texture,a.mapping)}else return null}}return a}function s(a){const r=a.target;r.removeEventListener("dispose",s);const c=e.get(r);c!==void 0&&(e.delete(r),c.dispose())}function o(){e=new WeakMap}return{get:i,dispose:o}}class wa extends Id{constructor(e=-1,t=1,i=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=i-e,a=i+e,r=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=u*this.view.offsetX,a=o+u*this.view.width,r-=l*this.view.offsetY,c=r-l*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const bs=4,dc=[.125,.215,.35,.446,.526,.582],Oi=20,ir=new wa,uc=new tt;let sr=null,or=0,ar=0,rr=!1;const Ui=(1+Math.sqrt(5))/2,gs=1/Ui,hc=[new U(-Ui,gs,0),new U(Ui,gs,0),new U(-gs,0,Ui),new U(gs,0,Ui),new U(0,Ui,-gs),new U(0,Ui,gs),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)];class fc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){sr=this._renderer.getRenderTarget(),or=this._renderer.getActiveCubeFace(),ar=this._renderer.getActiveMipmapLevel(),rr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(e,i,s,o),t>0&&this._blur(o,0,0,t),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=gc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=mc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(sr,or,ar),this._renderer.xr.enabled=rr,e.scissorTest=!1,Ho(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Is||e.mapping===Ds?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),sr=this._renderer.getRenderTarget(),or=this._renderer.getActiveCubeFace(),ar=this._renderer.getActiveMipmapLevel(),rr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:qi,format:Un,colorSpace:Si,depthBuffer:!1},s=pc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=pc(e,t,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ug(o)),this._blurMaterial=Fg(o,e,t)}return s}_compileMaterial(e){const t=new Pt(this._lodPlanes[0],e);this._renderer.compile(t,ir)}_sceneToCubeUV(e,t,i,s){const r=new un(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],l=this._renderer,h=l.autoClear,f=l.toneMapping;l.getClearColor(uc),l.toneMapping=yi,l.autoClear=!1;const m=new Yi({name:"PMREM.Background",side:Qt,depthWrite:!1,depthTest:!1}),x=new Pt(new xo,m);let y=!1;const g=e.background;g?g.isColor&&(m.color.copy(g),e.background=null,y=!0):(m.color.copy(uc),y=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(r.up.set(0,c[p],0),r.lookAt(u[p],0,0)):_===1?(r.up.set(0,0,c[p]),r.lookAt(0,u[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,u[p]));const v=this._cubeSize;Ho(s,_*v,p>2?v:0,v,v),l.setRenderTarget(s),y&&l.render(x,r),l.render(e,r)}x.geometry.dispose(),x.material.dispose(),l.toneMapping=f,l.autoClear=h,e.background=g}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Is||e.mapping===Ds;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=gc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=mc());const o=s?this._cubemapMaterial:this._equirectMaterial,a=new Pt(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=e;const c=this._cubeSize;Ho(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,ir)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const a=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),r=hc[(s-o-1)%hc.length];this._blur(e,o-1,o,a,r)}t.autoClear=i}_blur(e,t,i,s,o){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",o),this._halfBlur(a,e,i,i,s,"longitudinal",o)}_halfBlur(e,t,i,s,o,a,r){const c=this._renderer,u=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,h=new Pt(this._lodPlanes[s],u),f=u.uniforms,m=this._sizeLods[i]-1,x=isFinite(o)?Math.PI/(2*m):2*Math.PI/(2*Oi-1),y=o/x,g=isFinite(o)?1+Math.floor(l*y):Oi;g>Oi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Oi}`);const p=[];let _=0;for(let A=0;A<Oi;++A){const F=A/y,w=Math.exp(-F*F/2);p.push(w),A===0?_+=w:A<g&&(_+=2*w)}for(let A=0;A<p.length;A++)p[A]=p[A]/_;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:v}=this;f.dTheta.value=x,f.mipInt.value=v-i;const b=this._sizeLods[s],P=3*b*(s>v-bs?s-v+bs:0),C=4*(this._cubeSize-b);Ho(t,P,C,3*b,2*b),c.setRenderTarget(t),c.render(h,ir)}}function Ug(n){const e=[],t=[],i=[];let s=n;const o=n-bs+1+dc.length;for(let a=0;a<o;a++){const r=Math.pow(2,s);t.push(r);let c=1/r;a>n-bs?c=dc[a-n+bs-1]:a===0&&(c=0),i.push(c);const u=1/(r-2),l=-u,h=1+u,f=[l,l,h,l,h,h,l,l,h,h,l,h],m=6,x=6,y=3,g=2,p=1,_=new Float32Array(y*x*m),v=new Float32Array(g*x*m),b=new Float32Array(p*x*m);for(let C=0;C<m;C++){const A=C%3*2/3-1,F=C>2?0:-1,w=[A,F,0,A+2/3,F,0,A+2/3,F+1,0,A,F,0,A+2/3,F+1,0,A,F+1,0];_.set(w,y*x*C),v.set(f,g*x*C);const S=[C,C,C,C,C,C];b.set(S,p*x*C)}const P=new Xt;P.setAttribute("position",new en(_,y)),P.setAttribute("uv",new en(v,g)),P.setAttribute("faceIndex",new en(b,p)),e.push(P),s>bs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function pc(n,e,t){const i=new wn(n,e,t);return i.texture.mapping=Ma,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ho(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function Fg(n,e,t){const i=new Float32Array(Oi),s=new U(0,1,0);return new fn({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Br(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function mc(){return new fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Br(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function gc(){return new fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Br(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Br(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ng(n){let e=new WeakMap,t=null;function i(r){if(r&&r.isTexture){const c=r.mapping,u=c===Mr||c===br,l=c===Is||c===Ds;if(u||l){let h=e.get(r);const f=h!==void 0?h.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==f)return t===null&&(t=new fc(n)),h=u?t.fromEquirectangular(r,h):t.fromCubemap(r,h),h.texture.pmremVersion=r.pmremVersion,e.set(r,h),h.texture;if(h!==void 0)return h.texture;{const m=r.image;return u&&m&&m.height>0||l&&m&&s(m)?(t===null&&(t=new fc(n)),h=u?t.fromEquirectangular(r):t.fromCubemap(r),h.texture.pmremVersion=r.pmremVersion,e.set(r,h),r.addEventListener("dispose",o),h.texture):null}}}return r}function s(r){let c=0;const u=6;for(let l=0;l<u;l++)r[l]!==void 0&&c++;return c===u}function o(r){const c=r.target;c.removeEventListener("dispose",o);const u=e.get(c);u!==void 0&&(e.delete(c),u.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function Og(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Fr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Bg(n,e,t,i){const s={},o=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);for(const x in f.morphAttributes){const y=f.morphAttributes[x];for(let g=0,p=y.length;g<p;g++)e.remove(y[g])}f.removeEventListener("dispose",a),delete s[f.id];const m=o.get(f);m&&(e.remove(m),o.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function r(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(h){const f=h.attributes;for(const x in f)e.update(f[x],n.ARRAY_BUFFER);const m=h.morphAttributes;for(const x in m){const y=m[x];for(let g=0,p=y.length;g<p;g++)e.update(y[g],n.ARRAY_BUFFER)}}function u(h){const f=[],m=h.index,x=h.attributes.position;let y=0;if(m!==null){const _=m.array;y=m.version;for(let v=0,b=_.length;v<b;v+=3){const P=_[v+0],C=_[v+1],A=_[v+2];f.push(P,C,C,A,A,P)}}else if(x!==void 0){const _=x.array;y=x.version;for(let v=0,b=_.length/3-1;v<b;v+=3){const P=v+0,C=v+1,A=v+2;f.push(P,C,C,A,A,P)}}else return;const g=new(bd(f)?Pd:Rd)(f,1);g.version=y;const p=o.get(h);p&&e.remove(p),o.set(h,g)}function l(h){const f=o.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&u(h)}else u(h);return o.get(h)}return{get:r,update:c,getWireframeAttribute:l}}function kg(n,e,t){let i;function s(f){i=f}let o,a;function r(f){o=f.type,a=f.bytesPerElement}function c(f,m){n.drawElements(i,m,o,f*a),t.update(m,i,1)}function u(f,m,x){x!==0&&(n.drawElementsInstanced(i,m,o,f*a,x),t.update(m,i,x))}function l(f,m,x){if(x===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let g=0;g<x;g++)this.render(f[g]/a,m[g]);else{y.multiDrawElementsWEBGL(i,m,0,o,f,0,x);let g=0;for(let p=0;p<x;p++)g+=m[p];t.update(g,i,1)}}function h(f,m,x,y){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)u(f[p]/a,m[p],y[p]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,o,f,0,y,0,x);let p=0;for(let _=0;_<x;_++)p+=m[_];for(let _=0;_<y.length;_++)t.update(p,i,y[_])}}this.setMode=s,this.setIndex=r,this.render=c,this.renderInstances=u,this.renderMultiDraw=l,this.renderMultiDrawInstances=h}function zg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,a,r){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=r*(o/3);break;case n.LINES:t.lines+=r*(o/2);break;case n.LINE_STRIP:t.lines+=r*(o-1);break;case n.LINE_LOOP:t.lines+=r*o;break;case n.POINTS:t.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Vg(n,e,t){const i=new WeakMap,s=new Nt;function o(a,r,c){const u=a.morphTargetInfluences,l=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,h=l!==void 0?l.length:0;let f=i.get(r);if(f===void 0||f.count!==h){let w=function(){A.dispose(),i.delete(r),r.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const m=r.morphAttributes.position!==void 0,x=r.morphAttributes.normal!==void 0,y=r.morphAttributes.color!==void 0,g=r.morphAttributes.position||[],p=r.morphAttributes.normal||[],_=r.morphAttributes.color||[];let v=0;m===!0&&(v=1),x===!0&&(v=2),y===!0&&(v=3);let b=r.attributes.position.count*v,P=1;b>e.maxTextureSize&&(P=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const C=new Float32Array(b*P*4*h),A=new Ed(C,b,P,h);A.type=Jn,A.needsUpdate=!0;const F=v*4;for(let S=0;S<h;S++){const R=g[S],N=p[S],k=_[S],G=b*P*4*S;for(let X=0;X<R.count;X++){const Y=X*F;m===!0&&(s.fromBufferAttribute(R,X),C[G+Y+0]=s.x,C[G+Y+1]=s.y,C[G+Y+2]=s.z,C[G+Y+3]=0),x===!0&&(s.fromBufferAttribute(N,X),C[G+Y+4]=s.x,C[G+Y+5]=s.y,C[G+Y+6]=s.z,C[G+Y+7]=0),y===!0&&(s.fromBufferAttribute(k,X),C[G+Y+8]=s.x,C[G+Y+9]=s.y,C[G+Y+10]=s.z,C[G+Y+11]=k.itemSize===4?s.w:1)}}f={count:h,texture:A,size:new Ke(b,P)},i.set(r,f),r.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let m=0;for(let y=0;y<u.length;y++)m+=u[y];const x=r.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",x),c.getUniforms().setValue(n,"morphTargetInfluences",u)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:o}}function Hg(n,e,t,i){let s=new WeakMap;function o(c){const u=i.render.frame,l=c.geometry,h=e.get(c,l);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==u&&(f.update(),s.set(f,u))}return h}function a(){s=new WeakMap}function r(c){const u=c.target;u.removeEventListener("dispose",r),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}class Fd extends Ot{constructor(e,t,i,s,o,a,r,c,u,l=Es){if(l!==Es&&l!==Ns)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&l===Es&&(i=Us),i===void 0&&l===Ns&&(i=Fs),super(null,s,o,a,r,c,l,i,u),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=r!==void 0?r:Ht,this.minFilter=c!==void 0?c:Ht,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Nd=new Ot,Od=new Fd(1,1);Od.compareFunction=Md;const Bd=new Ed,kd=new Rf,zd=new Dd,xc=[],yc=[],vc=new Float32Array(16),_c=new Float32Array(9),Sc=new Float32Array(4);function Hs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let o=xc[s];if(o===void 0&&(o=new Float32Array(s),xc[s]=o),e!==0){i.toArray(o,0);for(let a=1,r=0;a!==e;++a)r+=t,n[a].toArray(o,r)}return o}function It(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Dt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ea(n,e){let t=yc[e];t===void 0&&(t=new Int32Array(e),yc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Gg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function jg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2fv(this.addr,e),Dt(t,e)}}function Wg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;n.uniform3fv(this.addr,e),Dt(t,e)}}function $g(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4fv(this.addr,e),Dt(t,e)}}function qg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(It(t,i))return;Sc.set(i),n.uniformMatrix2fv(this.addr,!1,Sc),Dt(t,i)}}function Xg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(It(t,i))return;_c.set(i),n.uniformMatrix3fv(this.addr,!1,_c),Dt(t,i)}}function Yg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(It(t,i))return;vc.set(i),n.uniformMatrix4fv(this.addr,!1,vc),Dt(t,i)}}function Kg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Jg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2iv(this.addr,e),Dt(t,e)}}function Zg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3iv(this.addr,e),Dt(t,e)}}function Qg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4iv(this.addr,e),Dt(t,e)}}function e0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function t0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2uiv(this.addr,e),Dt(t,e)}}function n0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3uiv(this.addr,e),Dt(t,e)}}function i0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4uiv(this.addr,e),Dt(t,e)}}function s0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);const o=this.type===n.SAMPLER_2D_SHADOW?Od:Nd;t.setTexture2D(e||o,s)}function o0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||kd,s)}function a0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||zd,s)}function r0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Bd,s)}function l0(n){switch(n){case 5126:return Gg;case 35664:return jg;case 35665:return Wg;case 35666:return $g;case 35674:return qg;case 35675:return Xg;case 35676:return Yg;case 5124:case 35670:return Kg;case 35667:case 35671:return Jg;case 35668:case 35672:return Zg;case 35669:case 35673:return Qg;case 5125:return e0;case 36294:return t0;case 36295:return n0;case 36296:return i0;case 35678:case 36198:case 36298:case 36306:case 35682:return s0;case 35679:case 36299:case 36307:return o0;case 35680:case 36300:case 36308:case 36293:return a0;case 36289:case 36303:case 36311:case 36292:return r0}}function c0(n,e){n.uniform1fv(this.addr,e)}function d0(n,e){const t=Hs(e,this.size,2);n.uniform2fv(this.addr,t)}function u0(n,e){const t=Hs(e,this.size,3);n.uniform3fv(this.addr,t)}function h0(n,e){const t=Hs(e,this.size,4);n.uniform4fv(this.addr,t)}function f0(n,e){const t=Hs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function p0(n,e){const t=Hs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function m0(n,e){const t=Hs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function g0(n,e){n.uniform1iv(this.addr,e)}function x0(n,e){n.uniform2iv(this.addr,e)}function y0(n,e){n.uniform3iv(this.addr,e)}function v0(n,e){n.uniform4iv(this.addr,e)}function _0(n,e){n.uniform1uiv(this.addr,e)}function S0(n,e){n.uniform2uiv(this.addr,e)}function M0(n,e){n.uniform3uiv(this.addr,e)}function b0(n,e){n.uniform4uiv(this.addr,e)}function w0(n,e,t){const i=this.cache,s=e.length,o=Ea(t,s);It(i,o)||(n.uniform1iv(this.addr,o),Dt(i,o));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Nd,o[a])}function E0(n,e,t){const i=this.cache,s=e.length,o=Ea(t,s);It(i,o)||(n.uniform1iv(this.addr,o),Dt(i,o));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||kd,o[a])}function C0(n,e,t){const i=this.cache,s=e.length,o=Ea(t,s);It(i,o)||(n.uniform1iv(this.addr,o),Dt(i,o));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||zd,o[a])}function T0(n,e,t){const i=this.cache,s=e.length,o=Ea(t,s);It(i,o)||(n.uniform1iv(this.addr,o),Dt(i,o));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Bd,o[a])}function A0(n){switch(n){case 5126:return c0;case 35664:return d0;case 35665:return u0;case 35666:return h0;case 35674:return f0;case 35675:return p0;case 35676:return m0;case 5124:case 35670:return g0;case 35667:case 35671:return x0;case 35668:case 35672:return y0;case 35669:case 35673:return v0;case 5125:return _0;case 36294:return S0;case 36295:return M0;case 36296:return b0;case 35678:case 36198:case 36298:case 36306:case 35682:return w0;case 35679:case 36299:case 36307:return E0;case 35680:case 36300:case 36308:case 36293:return C0;case 36289:case 36303:case 36311:case 36292:return T0}}class R0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=l0(t.type)}}class P0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=A0(t.type)}}class L0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const r=s[o];r.setValue(e,t[r.id],i)}}}const lr=/(\w+)(\])?(\[|\.)?/g;function Mc(n,e){n.seq.push(e),n.map[e.id]=e}function I0(n,e,t){const i=n.name,s=i.length;for(lr.lastIndex=0;;){const o=lr.exec(i),a=lr.lastIndex;let r=o[1];const c=o[2]==="]",u=o[3];if(c&&(r=r|0),u===void 0||u==="["&&a+2===s){Mc(t,u===void 0?new R0(r,n,e):new P0(r,n,e));break}else{let h=t.map[r];h===void 0&&(h=new L0(r),Mc(t,h)),t=h}}}class oa{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=e.getActiveUniform(t,s),a=e.getUniformLocation(t,o.name);I0(o,a,this)}}setValue(e,t,i,s){const o=this.map[t];o!==void 0&&o.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let o=0,a=t.length;o!==a;++o){const r=t[o],c=i[r.id];c.needsUpdate!==!1&&r.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,o=e.length;s!==o;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function bc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const D0=37297;let U0=0;function F0(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),o=Math.min(e+6,t.length);for(let a=s;a<o;a++){const r=a+1;i.push(`${r===e?">":" "} ${r}: ${t[a]}`)}return i.join(`
`)}function N0(n){const e=dt.getPrimaries(dt.workingColorSpace),t=dt.getPrimaries(n);let i;switch(e===t?i="":e===ua&&t===da?i="LinearDisplayP3ToLinearSRGB":e===da&&t===ua&&(i="LinearSRGBToLinearDisplayP3"),n){case Si:case ba:return[i,"LinearTransferOETF"];case Ln:case Dr:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function wc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+F0(n.getShaderSource(e),a)}else return s}function O0(n,e){const t=N0(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function B0(n,e){let t;switch(e){case Lh:t="Linear";break;case Ih:t="Reinhard";break;case Dh:t="OptimizedCineon";break;case Uh:t="ACESFilmic";break;case Nh:t="AgX";break;case Oh:t="Neutral";break;case Fh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function k0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(io).join(`
`)}function z0(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function V0(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=n.getActiveAttrib(e,s),a=o.name;let r=1;o.type===n.FLOAT_MAT2&&(r=2),o.type===n.FLOAT_MAT3&&(r=3),o.type===n.FLOAT_MAT4&&(r=4),t[a]={type:o.type,location:n.getAttribLocation(e,a),locationSize:r}}return t}function io(n){return n!==""}function Ec(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Cc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const H0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Tr(n){return n.replace(H0,j0)}const G0=new Map;function j0(n,e){let t=Ze[e];if(t===void 0){const i=G0.get(e);if(i!==void 0)t=Ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Tr(t)}const W0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tc(n){return n.replace(W0,$0)}function $0(n,e,t,i){let s="";for(let o=parseInt(e);o<parseInt(t);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function Ac(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function q0(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ud?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===ih?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===qn&&(e="SHADOWMAP_TYPE_VSM"),e}function X0(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Is:case Ds:e="ENVMAP_TYPE_CUBE";break;case Ma:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Y0(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ds:e="ENVMAP_MODE_REFRACTION";break}return e}function K0(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case hd:e="ENVMAP_BLENDING_MULTIPLY";break;case Rh:e="ENVMAP_BLENDING_MIX";break;case Ph:e="ENVMAP_BLENDING_ADD";break}return e}function J0(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Z0(n,e,t,i){const s=n.getContext(),o=t.defines;let a=t.vertexShader,r=t.fragmentShader;const c=q0(t),u=X0(t),l=Y0(t),h=K0(t),f=J0(t),m=k0(t),x=z0(o),y=s.createProgram();let g,p,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(io).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(io).join(`
`),p.length>0&&(p+=`
`)):(g=[Ac(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(io).join(`
`),p=[Ac(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yi?"#define TONE_MAPPING":"",t.toneMapping!==yi?Ze.tonemapping_pars_fragment:"",t.toneMapping!==yi?B0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,O0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(io).join(`
`)),a=Tr(a),a=Ec(a,t),a=Cc(a,t),r=Tr(r),r=Ec(r,t),r=Cc(r,t),a=Tc(a),r=Tc(r),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Gl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Gl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=_+g+a,b=_+p+r,P=bc(s,s.VERTEX_SHADER,v),C=bc(s,s.FRAGMENT_SHADER,b);s.attachShader(y,P),s.attachShader(y,C),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function A(R){if(n.debug.checkShaderErrors){const N=s.getProgramInfoLog(y).trim(),k=s.getShaderInfoLog(P).trim(),G=s.getShaderInfoLog(C).trim();let X=!0,Y=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,P,C);else{const J=wc(s,P,"vertex"),V=wc(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+N+`
`+J+`
`+V)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(k===""||G==="")&&(Y=!1);Y&&(R.diagnostics={runnable:X,programLog:N,vertexShader:{log:k,prefix:g},fragmentShader:{log:G,prefix:p}})}s.deleteShader(P),s.deleteShader(C),F=new oa(s,y),w=V0(s,y)}let F;this.getUniforms=function(){return F===void 0&&A(this),F};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(y,D0)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=U0++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=P,this.fragmentShader=C,this}let Q0=0;class ex{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),o=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new tx(e),t.set(e,i)),i}}class tx{constructor(e){this.id=Q0++,this.code=e,this.usedTimes=0}}function nx(n,e,t,i,s,o,a){const r=new Td,c=new ex,u=new Set,l=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(w){return u.add(w),w===0?"uv":`uv${w}`}function g(w,S,R,N,k){const G=N.fog,X=k.geometry,Y=w.isMeshStandardMaterial?N.environment:null,J=(w.isMeshStandardMaterial?t:e).get(w.envMap||Y),V=J&&J.mapping===Ma?J.image.height:null,ae=x[w.type];w.precision!==null&&(m=s.getMaxPrecision(w.precision),m!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",m,"instead."));const ce=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ue=ce!==void 0?ce.length:0;let Fe=0;X.morphAttributes.position!==void 0&&(Fe=1),X.morphAttributes.normal!==void 0&&(Fe=2),X.morphAttributes.color!==void 0&&(Fe=3);let He,q,te,re;if(ae){const Ve=In[ae];He=Ve.vertexShader,q=Ve.fragmentShader}else He=w.vertexShader,q=w.fragmentShader,c.update(w),te=c.getVertexShaderID(w),re=c.getFragmentShaderID(w);const O=n.getRenderTarget(),fe=k.isInstancedMesh===!0,Me=k.isBatchedMesh===!0,Ie=!!w.map,L=!!w.matcap,Ge=!!J,Ce=!!w.aoMap,Ne=!!w.lightMap,ge=!!w.bumpMap,Xe=!!w.normalMap,ve=!!w.displacementMap,be=!!w.emissiveMap,je=!!w.metalnessMap,T=!!w.roughnessMap,M=w.anisotropy>0,j=w.clearcoat>0,Q=w.dispersion>0,ne=w.iridescence>0,ie=w.sheen>0,Le=w.transmission>0,he=M&&!!w.anisotropyMap,de=j&&!!w.clearcoatMap,Be=j&&!!w.clearcoatNormalMap,se=j&&!!w.clearcoatRoughnessMap,we=ne&&!!w.iridescenceMap,Je=ne&&!!w.iridescenceThicknessMap,De=ie&&!!w.sheenColorMap,ye=ie&&!!w.sheenRoughnessMap,Ye=!!w.specularMap,We=!!w.specularColorMap,ut=!!w.specularIntensityMap,I=Le&&!!w.transmissionMap,me=Le&&!!w.thicknessMap,K=!!w.gradientMap,Z=!!w.alphaMap,oe=w.alphaTest>0,ee=!!w.alphaHash,pe=!!w.extensions;let Te=yi;w.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(Te=n.toneMapping);const Ae={shaderID:ae,shaderType:w.type,shaderName:w.name,vertexShader:He,fragmentShader:q,defines:w.defines,customVertexShaderID:te,customFragmentShaderID:re,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:m,batching:Me,batchingColor:Me&&k._colorsTexture!==null,instancing:fe,instancingColor:fe&&k.instanceColor!==null,instancingMorph:fe&&k.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:O===null?n.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:Si,alphaToCoverage:!!w.alphaToCoverage,map:Ie,matcap:L,envMap:Ge,envMapMode:Ge&&J.mapping,envMapCubeUVHeight:V,aoMap:Ce,lightMap:Ne,bumpMap:ge,normalMap:Xe,displacementMap:f&&ve,emissiveMap:be,normalMapObjectSpace:Xe&&w.normalMapType===Kh,normalMapTangentSpace:Xe&&w.normalMapType===Sd,metalnessMap:je,roughnessMap:T,anisotropy:M,anisotropyMap:he,clearcoat:j,clearcoatMap:de,clearcoatNormalMap:Be,clearcoatRoughnessMap:se,dispersion:Q,iridescence:ne,iridescenceMap:we,iridescenceThicknessMap:Je,sheen:ie,sheenColorMap:De,sheenRoughnessMap:ye,specularMap:Ye,specularColorMap:We,specularIntensityMap:ut,transmission:Le,transmissionMap:I,thicknessMap:me,gradientMap:K,opaque:w.transparent===!1&&w.blending===ji&&w.alphaToCoverage===!1,alphaMap:Z,alphaTest:oe,alphaHash:ee,combine:w.combine,mapUv:Ie&&y(w.map.channel),aoMapUv:Ce&&y(w.aoMap.channel),lightMapUv:Ne&&y(w.lightMap.channel),bumpMapUv:ge&&y(w.bumpMap.channel),normalMapUv:Xe&&y(w.normalMap.channel),displacementMapUv:ve&&y(w.displacementMap.channel),emissiveMapUv:be&&y(w.emissiveMap.channel),metalnessMapUv:je&&y(w.metalnessMap.channel),roughnessMapUv:T&&y(w.roughnessMap.channel),anisotropyMapUv:he&&y(w.anisotropyMap.channel),clearcoatMapUv:de&&y(w.clearcoatMap.channel),clearcoatNormalMapUv:Be&&y(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&y(w.clearcoatRoughnessMap.channel),iridescenceMapUv:we&&y(w.iridescenceMap.channel),iridescenceThicknessMapUv:Je&&y(w.iridescenceThicknessMap.channel),sheenColorMapUv:De&&y(w.sheenColorMap.channel),sheenRoughnessMapUv:ye&&y(w.sheenRoughnessMap.channel),specularMapUv:Ye&&y(w.specularMap.channel),specularColorMapUv:We&&y(w.specularColorMap.channel),specularIntensityMapUv:ut&&y(w.specularIntensityMap.channel),transmissionMapUv:I&&y(w.transmissionMap.channel),thicknessMapUv:me&&y(w.thicknessMap.channel),alphaMapUv:Z&&y(w.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Xe||M),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!X.attributes.uv&&(Ie||Z),fog:!!G,useFog:w.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:k.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:Fe,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Te,decodeVideoTexture:Ie&&w.map.isVideoTexture===!0&&dt.getTransfer(w.map.colorSpace)===St,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===hn,flipSided:w.side===Qt,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:pe&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:pe&&w.extensions.multiDraw===!0&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Ae.vertexUv1s=u.has(1),Ae.vertexUv2s=u.has(2),Ae.vertexUv3s=u.has(3),u.clear(),Ae}function p(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const R in w.defines)S.push(R),S.push(w.defines[R]);return w.isRawShaderMaterial===!1&&(_(S,w),v(S,w),S.push(n.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function _(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function v(w,S){r.disableAll(),S.supportsVertexTextures&&r.enable(0),S.instancing&&r.enable(1),S.instancingColor&&r.enable(2),S.instancingMorph&&r.enable(3),S.matcap&&r.enable(4),S.envMap&&r.enable(5),S.normalMapObjectSpace&&r.enable(6),S.normalMapTangentSpace&&r.enable(7),S.clearcoat&&r.enable(8),S.iridescence&&r.enable(9),S.alphaTest&&r.enable(10),S.vertexColors&&r.enable(11),S.vertexAlphas&&r.enable(12),S.vertexUv1s&&r.enable(13),S.vertexUv2s&&r.enable(14),S.vertexUv3s&&r.enable(15),S.vertexTangents&&r.enable(16),S.anisotropy&&r.enable(17),S.alphaHash&&r.enable(18),S.batching&&r.enable(19),S.dispersion&&r.enable(20),S.batchingColor&&r.enable(21),w.push(r.mask),r.disableAll(),S.fog&&r.enable(0),S.useFog&&r.enable(1),S.flatShading&&r.enable(2),S.logarithmicDepthBuffer&&r.enable(3),S.skinning&&r.enable(4),S.morphTargets&&r.enable(5),S.morphNormals&&r.enable(6),S.morphColors&&r.enable(7),S.premultipliedAlpha&&r.enable(8),S.shadowMapEnabled&&r.enable(9),S.doubleSided&&r.enable(10),S.flipSided&&r.enable(11),S.useDepthPacking&&r.enable(12),S.dithering&&r.enable(13),S.transmission&&r.enable(14),S.sheen&&r.enable(15),S.opaque&&r.enable(16),S.pointsUvs&&r.enable(17),S.decodeVideoTexture&&r.enable(18),S.alphaToCoverage&&r.enable(19),w.push(r.mask)}function b(w){const S=x[w.type];let R;if(S){const N=In[S];R=Nr.clone(N.uniforms)}else R=w.uniforms;return R}function P(w,S){let R;for(let N=0,k=l.length;N<k;N++){const G=l[N];if(G.cacheKey===S){R=G,++R.usedTimes;break}}return R===void 0&&(R=new Z0(n,S,w,o),l.push(R)),R}function C(w){if(--w.usedTimes===0){const S=l.indexOf(w);l[S]=l[l.length-1],l.pop(),w.destroy()}}function A(w){c.remove(w)}function F(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:b,acquireProgram:P,releaseProgram:C,releaseShaderCache:A,programs:l,dispose:F}}function ix(){let n=new WeakMap;function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function t(o){n.delete(o)}function i(o,a,r){n.get(o)[a]=r}function s(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:s}}function sx(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Rc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Pc(){const n=[];let e=0;const t=[],i=[],s=[];function o(){e=0,t.length=0,i.length=0,s.length=0}function a(h,f,m,x,y,g){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:m,groupOrder:x,renderOrder:h.renderOrder,z:y,group:g},n[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=m,p.groupOrder=x,p.renderOrder=h.renderOrder,p.z=y,p.group=g),e++,p}function r(h,f,m,x,y,g){const p=a(h,f,m,x,y,g);m.transmission>0?i.push(p):m.transparent===!0?s.push(p):t.push(p)}function c(h,f,m,x,y,g){const p=a(h,f,m,x,y,g);m.transmission>0?i.unshift(p):m.transparent===!0?s.unshift(p):t.unshift(p)}function u(h,f){t.length>1&&t.sort(h||sx),i.length>1&&i.sort(f||Rc),s.length>1&&s.sort(f||Rc)}function l(){for(let h=e,f=n.length;h<f;h++){const m=n[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:o,push:r,unshift:c,finish:l,sort:u}}function ox(){let n=new WeakMap;function e(i,s){const o=n.get(i);let a;return o===void 0?(a=new Pc,n.set(i,[a])):s>=o.length?(a=new Pc,o.push(a)):a=o[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function ax(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new tt};break;case"SpotLight":t={position:new U,direction:new U,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":t={color:new tt,position:new U,halfWidth:new U,halfHeight:new U};break}return n[e.id]=t,t}}}function rx(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let lx=0;function cx(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function dx(n){const e=new ax,t=rx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new U);const s=new U,o=new gt,a=new gt;function r(u){let l=0,h=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let m=0,x=0,y=0,g=0,p=0,_=0,v=0,b=0,P=0,C=0,A=0;u.sort(cx);for(let w=0,S=u.length;w<S;w++){const R=u[w],N=R.color,k=R.intensity,G=R.distance,X=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)l+=N.r*k,h+=N.g*k,f+=N.b*k;else if(R.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(R.sh.coefficients[Y],k);A++}else if(R.isDirectionalLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const J=R.shadow,V=t.get(R);V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,i.directionalShadow[m]=V,i.directionalShadowMap[m]=X,i.directionalShadowMatrix[m]=R.shadow.matrix,_++}i.directional[m]=Y,m++}else if(R.isSpotLight){const Y=e.get(R);Y.position.setFromMatrixPosition(R.matrixWorld),Y.color.copy(N).multiplyScalar(k),Y.distance=G,Y.coneCos=Math.cos(R.angle),Y.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),Y.decay=R.decay,i.spot[y]=Y;const J=R.shadow;if(R.map&&(i.spotLightMap[P]=R.map,P++,J.updateMatrices(R),R.castShadow&&C++),i.spotLightMatrix[y]=J.matrix,R.castShadow){const V=t.get(R);V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,i.spotShadow[y]=V,i.spotShadowMap[y]=X,b++}y++}else if(R.isRectAreaLight){const Y=e.get(R);Y.color.copy(N).multiplyScalar(k),Y.halfWidth.set(R.width*.5,0,0),Y.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=Y,g++}else if(R.isPointLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity),Y.distance=R.distance,Y.decay=R.decay,R.castShadow){const J=R.shadow,V=t.get(R);V.shadowBias=J.bias,V.shadowNormalBias=J.normalBias,V.shadowRadius=J.radius,V.shadowMapSize=J.mapSize,V.shadowCameraNear=J.camera.near,V.shadowCameraFar=J.camera.far,i.pointShadow[x]=V,i.pointShadowMap[x]=X,i.pointShadowMatrix[x]=R.shadow.matrix,v++}i.point[x]=Y,x++}else if(R.isHemisphereLight){const Y=e.get(R);Y.skyColor.copy(R.color).multiplyScalar(k),Y.groundColor.copy(R.groundColor).multiplyScalar(k),i.hemi[p]=Y,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xe.LTC_FLOAT_1,i.rectAreaLTC2=xe.LTC_FLOAT_2):(i.rectAreaLTC1=xe.LTC_HALF_1,i.rectAreaLTC2=xe.LTC_HALF_2)),i.ambient[0]=l,i.ambient[1]=h,i.ambient[2]=f;const F=i.hash;(F.directionalLength!==m||F.pointLength!==x||F.spotLength!==y||F.rectAreaLength!==g||F.hemiLength!==p||F.numDirectionalShadows!==_||F.numPointShadows!==v||F.numSpotShadows!==b||F.numSpotMaps!==P||F.numLightProbes!==A)&&(i.directional.length=m,i.spot.length=y,i.rectArea.length=g,i.point.length=x,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=b+P-C,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=A,F.directionalLength=m,F.pointLength=x,F.spotLength=y,F.rectAreaLength=g,F.hemiLength=p,F.numDirectionalShadows=_,F.numPointShadows=v,F.numSpotShadows=b,F.numSpotMaps=P,F.numLightProbes=A,i.version=lx++)}function c(u,l){let h=0,f=0,m=0,x=0,y=0;const g=l.matrixWorldInverse;for(let p=0,_=u.length;p<_;p++){const v=u[p];if(v.isDirectionalLight){const b=i.directional[h];b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),h++}else if(v.isSpotLight){const b=i.spot[m];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),m++}else if(v.isRectAreaLight){const b=i.rectArea[x];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(g),a.identity(),o.copy(v.matrixWorld),o.premultiply(g),a.extractRotation(o),b.halfWidth.set(v.width*.5,0,0),b.halfHeight.set(0,v.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){const b=i.point[f];b.position.setFromMatrixPosition(v.matrixWorld),b.position.applyMatrix4(g),f++}else if(v.isHemisphereLight){const b=i.hemi[y];b.direction.setFromMatrixPosition(v.matrixWorld),b.direction.transformDirection(g),y++}}}return{setup:r,setupView:c,state:i}}function Lc(n){const e=new dx(n),t=[],i=[];function s(l){u.camera=l,t.length=0,i.length=0}function o(l){t.push(l)}function a(l){i.push(l)}function r(){e.setup(t)}function c(l){e.setupView(t,l)}const u={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:u,setupLights:r,setupLightsView:c,pushLight:o,pushShadow:a}}function ux(n){let e=new WeakMap;function t(s,o=0){const a=e.get(s);let r;return a===void 0?(r=new Lc(n),e.set(s,[r])):o>=a.length?(r=new Lc(n),a.push(r)):r=a[o],r}function i(){e=new WeakMap}return{get:t,dispose:i}}class hx extends Xi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class fx extends Xi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const px=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function gx(n,e,t){let i=new Or;const s=new Ke,o=new Ke,a=new Nt,r=new hx({depthPacking:Yh}),c=new fx,u={},l=t.maxTextureSize,h={[Fn]:Qt,[Qt]:Fn,[hn]:hn},f=new fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ke},radius:{value:4}},vertexShader:px,fragmentShader:mx}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const x=new Xt;x.setAttribute("position",new en(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Pt(x,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ud;let p=this.type;this.render=function(C,A,F){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||C.length===0)return;const w=n.getRenderTarget(),S=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),N=n.state;N.setBlending(Qn),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const k=p!==qn&&this.type===qn,G=p===qn&&this.type!==qn;for(let X=0,Y=C.length;X<Y;X++){const J=C[X],V=J.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ae=V.getFrameExtents();if(s.multiply(ae),o.copy(V.mapSize),(s.x>l||s.y>l)&&(s.x>l&&(o.x=Math.floor(l/ae.x),s.x=o.x*ae.x,V.mapSize.x=o.x),s.y>l&&(o.y=Math.floor(l/ae.y),s.y=o.y*ae.y,V.mapSize.y=o.y)),V.map===null||k===!0||G===!0){const ue=this.type!==qn?{minFilter:Ht,magFilter:Ht}:{};V.map!==null&&V.map.dispose(),V.map=new wn(s.x,s.y,ue),V.map.texture.name=J.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const ce=V.getViewportCount();for(let ue=0;ue<ce;ue++){const Fe=V.getViewport(ue);a.set(o.x*Fe.x,o.y*Fe.y,o.x*Fe.z,o.y*Fe.w),N.viewport(a),V.updateMatrices(J,ue),i=V.getFrustum(),b(A,F,V.camera,J,this.type)}V.isPointLightShadow!==!0&&this.type===qn&&_(V,F),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(w,S,R)};function _(C,A){const F=e.update(y);f.defines.VSM_SAMPLES!==C.blurSamples&&(f.defines.VSM_SAMPLES=C.blurSamples,m.defines.VSM_SAMPLES=C.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new wn(s.x,s.y)),f.uniforms.shadow_pass.value=C.map.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,n.setRenderTarget(C.mapPass),n.clear(),n.renderBufferDirect(A,null,F,f,y,null),m.uniforms.shadow_pass.value=C.mapPass.texture,m.uniforms.resolution.value=C.mapSize,m.uniforms.radius.value=C.radius,n.setRenderTarget(C.map),n.clear(),n.renderBufferDirect(A,null,F,m,y,null)}function v(C,A,F,w){let S=null;const R=F.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(R!==void 0)S=R;else if(S=F.isPointLight===!0?c:r,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const N=S.uuid,k=A.uuid;let G=u[N];G===void 0&&(G={},u[N]=G);let X=G[k];X===void 0&&(X=S.clone(),G[k]=X,A.addEventListener("dispose",P)),S=X}if(S.visible=A.visible,S.wireframe=A.wireframe,w===qn?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:h[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,F.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const N=n.properties.get(S);N.light=F}return S}function b(C,A,F,w,S){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&S===qn)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,C.matrixWorld);const k=e.update(C),G=C.material;if(Array.isArray(G)){const X=k.groups;for(let Y=0,J=X.length;Y<J;Y++){const V=X[Y],ae=G[V.materialIndex];if(ae&&ae.visible){const ce=v(C,ae,w,S);C.onBeforeShadow(n,C,A,F,k,ce,V),n.renderBufferDirect(F,null,k,ce,C,V),C.onAfterShadow(n,C,A,F,k,ce,V)}}}else if(G.visible){const X=v(C,G,w,S);C.onBeforeShadow(n,C,A,F,k,X,null),n.renderBufferDirect(F,null,k,X,C,null),C.onAfterShadow(n,C,A,F,k,X,null)}}const N=C.children;for(let k=0,G=N.length;k<G;k++)b(N[k],A,F,w,S)}function P(C){C.target.removeEventListener("dispose",P);for(const F in u){const w=u[F],S=C.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}function xx(n){function e(){let I=!1;const me=new Nt;let K=null;const Z=new Nt(0,0,0,0);return{setMask:function(oe){K!==oe&&!I&&(n.colorMask(oe,oe,oe,oe),K=oe)},setLocked:function(oe){I=oe},setClear:function(oe,ee,pe,Te,Ae){Ae===!0&&(oe*=Te,ee*=Te,pe*=Te),me.set(oe,ee,pe,Te),Z.equals(me)===!1&&(n.clearColor(oe,ee,pe,Te),Z.copy(me))},reset:function(){I=!1,K=null,Z.set(-1,0,0,0)}}}function t(){let I=!1,me=null,K=null,Z=null;return{setTest:function(oe){oe?re(n.DEPTH_TEST):O(n.DEPTH_TEST)},setMask:function(oe){me!==oe&&!I&&(n.depthMask(oe),me=oe)},setFunc:function(oe){if(K!==oe){switch(oe){case Mh:n.depthFunc(n.NEVER);break;case bh:n.depthFunc(n.ALWAYS);break;case wh:n.depthFunc(n.LESS);break;case ra:n.depthFunc(n.LEQUAL);break;case Eh:n.depthFunc(n.EQUAL);break;case Ch:n.depthFunc(n.GEQUAL);break;case Th:n.depthFunc(n.GREATER);break;case Ah:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}K=oe}},setLocked:function(oe){I=oe},setClear:function(oe){Z!==oe&&(n.clearDepth(oe),Z=oe)},reset:function(){I=!1,me=null,K=null,Z=null}}}function i(){let I=!1,me=null,K=null,Z=null,oe=null,ee=null,pe=null,Te=null,Ae=null;return{setTest:function(Ve){I||(Ve?re(n.STENCIL_TEST):O(n.STENCIL_TEST))},setMask:function(Ve){me!==Ve&&!I&&(n.stencilMask(Ve),me=Ve)},setFunc:function(Ve,ht,yt){(K!==Ve||Z!==ht||oe!==yt)&&(n.stencilFunc(Ve,ht,yt),K=Ve,Z=ht,oe=yt)},setOp:function(Ve,ht,yt){(ee!==Ve||pe!==ht||Te!==yt)&&(n.stencilOp(Ve,ht,yt),ee=Ve,pe=ht,Te=yt)},setLocked:function(Ve){I=Ve},setClear:function(Ve){Ae!==Ve&&(n.clearStencil(Ve),Ae=Ve)},reset:function(){I=!1,me=null,K=null,Z=null,oe=null,ee=null,pe=null,Te=null,Ae=null}}}const s=new e,o=new t,a=new i,r=new WeakMap,c=new WeakMap;let u={},l={},h=new WeakMap,f=[],m=null,x=!1,y=null,g=null,p=null,_=null,v=null,b=null,P=null,C=new tt(0,0,0),A=0,F=!1,w=null,S=null,R=null,N=null,k=null;const G=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,Y=0;const J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(J)[1]),X=Y>=1):J.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),X=Y>=2);let V=null,ae={};const ce=n.getParameter(n.SCISSOR_BOX),ue=n.getParameter(n.VIEWPORT),Fe=new Nt().fromArray(ce),He=new Nt().fromArray(ue);function q(I,me,K,Z){const oe=new Uint8Array(4),ee=n.createTexture();n.bindTexture(I,ee),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let pe=0;pe<K;pe++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(me,0,n.RGBA,1,1,Z,0,n.RGBA,n.UNSIGNED_BYTE,oe):n.texImage2D(me+pe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,oe);return ee}const te={};te[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),te[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),te[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),re(n.DEPTH_TEST),o.setFunc(ra),ge(!1),Xe(hl),re(n.CULL_FACE),Ce(Qn);function re(I){u[I]!==!0&&(n.enable(I),u[I]=!0)}function O(I){u[I]!==!1&&(n.disable(I),u[I]=!1)}function fe(I,me){return l[I]!==me?(n.bindFramebuffer(I,me),l[I]=me,I===n.DRAW_FRAMEBUFFER&&(l[n.FRAMEBUFFER]=me),I===n.FRAMEBUFFER&&(l[n.DRAW_FRAMEBUFFER]=me),!0):!1}function Me(I,me){let K=f,Z=!1;if(I){K=h.get(me),K===void 0&&(K=[],h.set(me,K));const oe=I.textures;if(K.length!==oe.length||K[0]!==n.COLOR_ATTACHMENT0){for(let ee=0,pe=oe.length;ee<pe;ee++)K[ee]=n.COLOR_ATTACHMENT0+ee;K.length=oe.length,Z=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,Z=!0);Z&&n.drawBuffers(K)}function Ie(I){return m!==I?(n.useProgram(I),m=I,!0):!1}const L={[Ni]:n.FUNC_ADD,[oh]:n.FUNC_SUBTRACT,[ah]:n.FUNC_REVERSE_SUBTRACT};L[rh]=n.MIN,L[lh]=n.MAX;const Ge={[ch]:n.ZERO,[dh]:n.ONE,[uh]:n.SRC_COLOR,[_r]:n.SRC_ALPHA,[xh]:n.SRC_ALPHA_SATURATE,[mh]:n.DST_COLOR,[fh]:n.DST_ALPHA,[hh]:n.ONE_MINUS_SRC_COLOR,[Sr]:n.ONE_MINUS_SRC_ALPHA,[gh]:n.ONE_MINUS_DST_COLOR,[ph]:n.ONE_MINUS_DST_ALPHA,[yh]:n.CONSTANT_COLOR,[vh]:n.ONE_MINUS_CONSTANT_COLOR,[_h]:n.CONSTANT_ALPHA,[Sh]:n.ONE_MINUS_CONSTANT_ALPHA};function Ce(I,me,K,Z,oe,ee,pe,Te,Ae,Ve){if(I===Qn){x===!0&&(O(n.BLEND),x=!1);return}if(x===!1&&(re(n.BLEND),x=!0),I!==sh){if(I!==y||Ve!==F){if((g!==Ni||v!==Ni)&&(n.blendEquation(n.FUNC_ADD),g=Ni,v=Ni),Ve)switch(I){case ji:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case fl:n.blendFunc(n.ONE,n.ONE);break;case pl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ml:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ji:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case fl:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case pl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ml:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}p=null,_=null,b=null,P=null,C.set(0,0,0),A=0,y=I,F=Ve}return}oe=oe||me,ee=ee||K,pe=pe||Z,(me!==g||oe!==v)&&(n.blendEquationSeparate(L[me],L[oe]),g=me,v=oe),(K!==p||Z!==_||ee!==b||pe!==P)&&(n.blendFuncSeparate(Ge[K],Ge[Z],Ge[ee],Ge[pe]),p=K,_=Z,b=ee,P=pe),(Te.equals(C)===!1||Ae!==A)&&(n.blendColor(Te.r,Te.g,Te.b,Ae),C.copy(Te),A=Ae),y=I,F=!1}function Ne(I,me){I.side===hn?O(n.CULL_FACE):re(n.CULL_FACE);let K=I.side===Qt;me&&(K=!K),ge(K),I.blending===ji&&I.transparent===!1?Ce(Qn):Ce(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),s.setMask(I.colorWrite);const Z=I.stencilWrite;a.setTest(Z),Z&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),be(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?re(n.SAMPLE_ALPHA_TO_COVERAGE):O(n.SAMPLE_ALPHA_TO_COVERAGE)}function ge(I){w!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),w=I)}function Xe(I){I!==th?(re(n.CULL_FACE),I!==S&&(I===hl?n.cullFace(n.BACK):I===nh?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):O(n.CULL_FACE),S=I}function ve(I){I!==R&&(X&&n.lineWidth(I),R=I)}function be(I,me,K){I?(re(n.POLYGON_OFFSET_FILL),(N!==me||k!==K)&&(n.polygonOffset(me,K),N=me,k=K)):O(n.POLYGON_OFFSET_FILL)}function je(I){I?re(n.SCISSOR_TEST):O(n.SCISSOR_TEST)}function T(I){I===void 0&&(I=n.TEXTURE0+G-1),V!==I&&(n.activeTexture(I),V=I)}function M(I,me,K){K===void 0&&(V===null?K=n.TEXTURE0+G-1:K=V);let Z=ae[K];Z===void 0&&(Z={type:void 0,texture:void 0},ae[K]=Z),(Z.type!==I||Z.texture!==me)&&(V!==K&&(n.activeTexture(K),V=K),n.bindTexture(I,me||te[I]),Z.type=I,Z.texture=me)}function j(){const I=ae[V];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Q(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ne(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ie(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Le(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function he(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function de(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Be(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function se(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function we(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Je(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function De(I){Fe.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),Fe.copy(I))}function ye(I){He.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),He.copy(I))}function Ye(I,me){let K=c.get(me);K===void 0&&(K=new WeakMap,c.set(me,K));let Z=K.get(I);Z===void 0&&(Z=n.getUniformBlockIndex(me,I.name),K.set(I,Z))}function We(I,me){const Z=c.get(me).get(I);r.get(me)!==Z&&(n.uniformBlockBinding(me,Z,I.__bindingPointIndex),r.set(me,Z))}function ut(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},V=null,ae={},l={},h=new WeakMap,f=[],m=null,x=!1,y=null,g=null,p=null,_=null,v=null,b=null,P=null,C=new tt(0,0,0),A=0,F=!1,w=null,S=null,R=null,N=null,k=null,Fe.set(0,0,n.canvas.width,n.canvas.height),He.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:re,disable:O,bindFramebuffer:fe,drawBuffers:Me,useProgram:Ie,setBlending:Ce,setMaterial:Ne,setFlipSided:ge,setCullFace:Xe,setLineWidth:ve,setPolygonOffset:be,setScissorTest:je,activeTexture:T,bindTexture:M,unbindTexture:j,compressedTexImage2D:Q,compressedTexImage3D:ne,texImage2D:we,texImage3D:Je,updateUBOMapping:Ye,uniformBlockBinding:We,texStorage2D:Be,texStorage3D:se,texSubImage2D:ie,texSubImage3D:Le,compressedTexSubImage2D:he,compressedTexSubImage3D:de,scissor:De,viewport:ye,reset:ut}}function yx(n,e,t,i,s,o,a){const r=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new Ke,l=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(T,M){return m?new OffscreenCanvas(T,M):fo("canvas")}function y(T,M,j){let Q=1;const ne=je(T);if((ne.width>j||ne.height>j)&&(Q=j/Math.max(ne.width,ne.height)),Q<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const ie=Math.floor(Q*ne.width),Le=Math.floor(Q*ne.height);h===void 0&&(h=x(ie,Le));const he=M?x(ie,Le):h;return he.width=ie,he.height=Le,he.getContext("2d").drawImage(T,0,0,ie,Le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+ie+"x"+Le+")."),he}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),T;return T}function g(T){return T.generateMipmaps&&T.minFilter!==Ht&&T.minFilter!==Sn}function p(T){n.generateMipmap(T)}function _(T,M,j,Q,ne=!1){if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let ie=M;if(M===n.RED&&(j===n.FLOAT&&(ie=n.R32F),j===n.HALF_FLOAT&&(ie=n.R16F),j===n.UNSIGNED_BYTE&&(ie=n.R8)),M===n.RED_INTEGER&&(j===n.UNSIGNED_BYTE&&(ie=n.R8UI),j===n.UNSIGNED_SHORT&&(ie=n.R16UI),j===n.UNSIGNED_INT&&(ie=n.R32UI),j===n.BYTE&&(ie=n.R8I),j===n.SHORT&&(ie=n.R16I),j===n.INT&&(ie=n.R32I)),M===n.RG&&(j===n.FLOAT&&(ie=n.RG32F),j===n.HALF_FLOAT&&(ie=n.RG16F),j===n.UNSIGNED_BYTE&&(ie=n.RG8)),M===n.RG_INTEGER&&(j===n.UNSIGNED_BYTE&&(ie=n.RG8UI),j===n.UNSIGNED_SHORT&&(ie=n.RG16UI),j===n.UNSIGNED_INT&&(ie=n.RG32UI),j===n.BYTE&&(ie=n.RG8I),j===n.SHORT&&(ie=n.RG16I),j===n.INT&&(ie=n.RG32I)),M===n.RGB&&j===n.UNSIGNED_INT_5_9_9_9_REV&&(ie=n.RGB9_E5),M===n.RGBA){const Le=ne?ca:dt.getTransfer(Q);j===n.FLOAT&&(ie=n.RGBA32F),j===n.HALF_FLOAT&&(ie=n.RGBA16F),j===n.UNSIGNED_BYTE&&(ie=Le===St?n.SRGB8_ALPHA8:n.RGBA8),j===n.UNSIGNED_SHORT_4_4_4_4&&(ie=n.RGBA4),j===n.UNSIGNED_SHORT_5_5_5_1&&(ie=n.RGB5_A1)}return(ie===n.R16F||ie===n.R32F||ie===n.RG16F||ie===n.RG32F||ie===n.RGBA16F||ie===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ie}function v(T,M){let j;return T?M===null||M===Us||M===Fs?j=n.DEPTH24_STENCIL8:M===Jn?j=n.DEPTH32F_STENCIL8:M===la&&(j=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Us||M===Fs?j=n.DEPTH_COMPONENT24:M===Jn?j=n.DEPTH_COMPONENT32F:M===la&&(j=n.DEPTH_COMPONENT16),j}function b(T,M){return g(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ht&&T.minFilter!==Sn?Math.log2(Math.max(M.width,M.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?M.mipmaps.length:1}function P(T){const M=T.target;M.removeEventListener("dispose",P),A(M),M.isVideoTexture&&l.delete(M)}function C(T){const M=T.target;M.removeEventListener("dispose",C),w(M)}function A(T){const M=i.get(T);if(M.__webglInit===void 0)return;const j=T.source,Q=f.get(j);if(Q){const ne=Q[M.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&F(T),Object.keys(Q).length===0&&f.delete(j)}i.remove(T)}function F(T){const M=i.get(T);n.deleteTexture(M.__webglTexture);const j=T.source,Q=f.get(j);delete Q[M.__cacheKey],a.memory.textures--}function w(T){const M=i.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(M.__webglFramebuffer[Q]))for(let ne=0;ne<M.__webglFramebuffer[Q].length;ne++)n.deleteFramebuffer(M.__webglFramebuffer[Q][ne]);else n.deleteFramebuffer(M.__webglFramebuffer[Q]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[Q])}else{if(Array.isArray(M.__webglFramebuffer))for(let Q=0;Q<M.__webglFramebuffer.length;Q++)n.deleteFramebuffer(M.__webglFramebuffer[Q]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Q=0;Q<M.__webglColorRenderbuffer.length;Q++)M.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[Q]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const j=T.textures;for(let Q=0,ne=j.length;Q<ne;Q++){const ie=i.get(j[Q]);ie.__webglTexture&&(n.deleteTexture(ie.__webglTexture),a.memory.textures--),i.remove(j[Q])}i.remove(T)}let S=0;function R(){S=0}function N(){const T=S;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),S+=1,T}function k(T){const M=[];return M.push(T.wrapS),M.push(T.wrapT),M.push(T.wrapR||0),M.push(T.magFilter),M.push(T.minFilter),M.push(T.anisotropy),M.push(T.internalFormat),M.push(T.format),M.push(T.type),M.push(T.generateMipmaps),M.push(T.premultiplyAlpha),M.push(T.flipY),M.push(T.unpackAlignment),M.push(T.colorSpace),M.join()}function G(T,M){const j=i.get(T);if(T.isVideoTexture&&ve(T),T.isRenderTargetTexture===!1&&T.version>0&&j.__version!==T.version){const Q=T.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{He(j,T,M);return}}t.bindTexture(n.TEXTURE_2D,j.__webglTexture,n.TEXTURE0+M)}function X(T,M){const j=i.get(T);if(T.version>0&&j.__version!==T.version){He(j,T,M);return}t.bindTexture(n.TEXTURE_2D_ARRAY,j.__webglTexture,n.TEXTURE0+M)}function Y(T,M){const j=i.get(T);if(T.version>0&&j.__version!==T.version){He(j,T,M);return}t.bindTexture(n.TEXTURE_3D,j.__webglTexture,n.TEXTURE0+M)}function J(T,M){const j=i.get(T);if(T.version>0&&j.__version!==T.version){q(j,T,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture,n.TEXTURE0+M)}const V={[wr]:n.REPEAT,[zi]:n.CLAMP_TO_EDGE,[Er]:n.MIRRORED_REPEAT},ae={[Ht]:n.NEAREST,[Bh]:n.NEAREST_MIPMAP_NEAREST,[So]:n.NEAREST_MIPMAP_LINEAR,[Sn]:n.LINEAR,[Da]:n.LINEAR_MIPMAP_NEAREST,[Vi]:n.LINEAR_MIPMAP_LINEAR},ce={[Jh]:n.NEVER,[sf]:n.ALWAYS,[Zh]:n.LESS,[Md]:n.LEQUAL,[Qh]:n.EQUAL,[nf]:n.GEQUAL,[ef]:n.GREATER,[tf]:n.NOTEQUAL};function ue(T,M){if(M.type===Jn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Sn||M.magFilter===Da||M.magFilter===So||M.magFilter===Vi||M.minFilter===Sn||M.minFilter===Da||M.minFilter===So||M.minFilter===Vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,V[M.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,V[M.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,V[M.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,ae[M.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,ae[M.minFilter]),M.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,ce[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Ht||M.minFilter!==So&&M.minFilter!==Vi||M.type===Jn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Fe(T,M){let j=!1;T.__webglInit===void 0&&(T.__webglInit=!0,M.addEventListener("dispose",P));const Q=M.source;let ne=f.get(Q);ne===void 0&&(ne={},f.set(Q,ne));const ie=k(M);if(ie!==T.__cacheKey){ne[ie]===void 0&&(ne[ie]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,j=!0),ne[ie].usedTimes++;const Le=ne[T.__cacheKey];Le!==void 0&&(ne[T.__cacheKey].usedTimes--,Le.usedTimes===0&&F(M)),T.__cacheKey=ie,T.__webglTexture=ne[ie].texture}return j}function He(T,M,j){let Q=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Q=n.TEXTURE_3D);const ne=Fe(T,M),ie=M.source;t.bindTexture(Q,T.__webglTexture,n.TEXTURE0+j);const Le=i.get(ie);if(ie.version!==Le.__version||ne===!0){t.activeTexture(n.TEXTURE0+j);const he=dt.getPrimaries(dt.workingColorSpace),de=M.colorSpace===fi?null:dt.getPrimaries(M.colorSpace),Be=M.colorSpace===fi||he===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be);let se=y(M.image,!1,s.maxTextureSize);se=be(M,se);const we=o.convert(M.format,M.colorSpace),Je=o.convert(M.type);let De=_(M.internalFormat,we,Je,M.colorSpace,M.isVideoTexture);ue(Q,M);let ye;const Ye=M.mipmaps,We=M.isVideoTexture!==!0,ut=Le.__version===void 0||ne===!0,I=ie.dataReady,me=b(M,se);if(M.isDepthTexture)De=v(M.format===Ns,M.type),ut&&(We?t.texStorage2D(n.TEXTURE_2D,1,De,se.width,se.height):t.texImage2D(n.TEXTURE_2D,0,De,se.width,se.height,0,we,Je,null));else if(M.isDataTexture)if(Ye.length>0){We&&ut&&t.texStorage2D(n.TEXTURE_2D,me,De,Ye[0].width,Ye[0].height);for(let K=0,Z=Ye.length;K<Z;K++)ye=Ye[K],We?I&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,ye.width,ye.height,we,Je,ye.data):t.texImage2D(n.TEXTURE_2D,K,De,ye.width,ye.height,0,we,Je,ye.data);M.generateMipmaps=!1}else We?(ut&&t.texStorage2D(n.TEXTURE_2D,me,De,se.width,se.height),I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,se.width,se.height,we,Je,se.data)):t.texImage2D(n.TEXTURE_2D,0,De,se.width,se.height,0,we,Je,se.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){We&&ut&&t.texStorage3D(n.TEXTURE_2D_ARRAY,me,De,Ye[0].width,Ye[0].height,se.depth);for(let K=0,Z=Ye.length;K<Z;K++)if(ye=Ye[K],M.format!==Un)if(we!==null)if(We){if(I)if(M.layerUpdates.size>0){for(const oe of M.layerUpdates){const ee=ye.width*ye.height;t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,oe,ye.width,ye.height,1,we,ye.data.slice(ee*oe,ee*(oe+1)),0,0)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ye.width,ye.height,se.depth,we,ye.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,De,ye.width,ye.height,se.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?I&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ye.width,ye.height,se.depth,we,Je,ye.data):t.texImage3D(n.TEXTURE_2D_ARRAY,K,De,ye.width,ye.height,se.depth,0,we,Je,ye.data)}else{We&&ut&&t.texStorage2D(n.TEXTURE_2D,me,De,Ye[0].width,Ye[0].height);for(let K=0,Z=Ye.length;K<Z;K++)ye=Ye[K],M.format!==Un?we!==null?We?I&&t.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,ye.width,ye.height,we,ye.data):t.compressedTexImage2D(n.TEXTURE_2D,K,De,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?I&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,ye.width,ye.height,we,Je,ye.data):t.texImage2D(n.TEXTURE_2D,K,De,ye.width,ye.height,0,we,Je,ye.data)}else if(M.isDataArrayTexture)if(We){if(ut&&t.texStorage3D(n.TEXTURE_2D_ARRAY,me,De,se.width,se.height,se.depth),I)if(M.layerUpdates.size>0){let K;switch(Je){case n.UNSIGNED_BYTE:switch(we){case n.ALPHA:K=1;break;case n.LUMINANCE:K=1;break;case n.LUMINANCE_ALPHA:K=2;break;case n.RGB:K=3;break;case n.RGBA:K=4;break;default:throw new Error(`Unknown texel size for format ${we}.`)}break;case n.UNSIGNED_SHORT_4_4_4_4:case n.UNSIGNED_SHORT_5_5_5_1:case n.UNSIGNED_SHORT_5_6_5:K=1;break;default:throw new Error(`Unknown texel size for type ${Je}.`)}const Z=se.width*se.height*K;for(const oe of M.layerUpdates)t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,oe,se.width,se.height,1,we,Je,se.data.slice(Z*oe,Z*(oe+1)));M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,we,Je,se.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,De,se.width,se.height,se.depth,0,we,Je,se.data);else if(M.isData3DTexture)We?(ut&&t.texStorage3D(n.TEXTURE_3D,me,De,se.width,se.height,se.depth),I&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,we,Je,se.data)):t.texImage3D(n.TEXTURE_3D,0,De,se.width,se.height,se.depth,0,we,Je,se.data);else if(M.isFramebufferTexture){if(ut)if(We)t.texStorage2D(n.TEXTURE_2D,me,De,se.width,se.height);else{let K=se.width,Z=se.height;for(let oe=0;oe<me;oe++)t.texImage2D(n.TEXTURE_2D,oe,De,K,Z,0,we,Je,null),K>>=1,Z>>=1}}else if(Ye.length>0){if(We&&ut){const K=je(Ye[0]);t.texStorage2D(n.TEXTURE_2D,me,De,K.width,K.height)}for(let K=0,Z=Ye.length;K<Z;K++)ye=Ye[K],We?I&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,we,Je,ye):t.texImage2D(n.TEXTURE_2D,K,De,we,Je,ye);M.generateMipmaps=!1}else if(We){if(ut){const K=je(se);t.texStorage2D(n.TEXTURE_2D,me,De,K.width,K.height)}I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,we,Je,se)}else t.texImage2D(n.TEXTURE_2D,0,De,we,Je,se);g(M)&&p(Q),Le.__version=ie.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function q(T,M,j){if(M.image.length!==6)return;const Q=Fe(T,M),ne=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+j);const ie=i.get(ne);if(ne.version!==ie.__version||Q===!0){t.activeTexture(n.TEXTURE0+j);const Le=dt.getPrimaries(dt.workingColorSpace),he=M.colorSpace===fi?null:dt.getPrimaries(M.colorSpace),de=M.colorSpace===fi||Le===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);const Be=M.isCompressedTexture||M.image[0].isCompressedTexture,se=M.image[0]&&M.image[0].isDataTexture,we=[];for(let Z=0;Z<6;Z++)!Be&&!se?we[Z]=y(M.image[Z],!0,s.maxCubemapSize):we[Z]=se?M.image[Z].image:M.image[Z],we[Z]=be(M,we[Z]);const Je=we[0],De=o.convert(M.format,M.colorSpace),ye=o.convert(M.type),Ye=_(M.internalFormat,De,ye,M.colorSpace),We=M.isVideoTexture!==!0,ut=ie.__version===void 0||Q===!0,I=ne.dataReady;let me=b(M,Je);ue(n.TEXTURE_CUBE_MAP,M);let K;if(Be){We&&ut&&t.texStorage2D(n.TEXTURE_CUBE_MAP,me,Ye,Je.width,Je.height);for(let Z=0;Z<6;Z++){K=we[Z].mipmaps;for(let oe=0;oe<K.length;oe++){const ee=K[oe];M.format!==Un?De!==null?We?I&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe,0,0,ee.width,ee.height,De,ee.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe,Ye,ee.width,ee.height,0,ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe,0,0,ee.width,ee.height,De,ye,ee.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe,Ye,ee.width,ee.height,0,De,ye,ee.data)}}}else{if(K=M.mipmaps,We&&ut){K.length>0&&me++;const Z=je(we[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,me,Ye,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(se){We?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,we[Z].width,we[Z].height,De,ye,we[Z].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ye,we[Z].width,we[Z].height,0,De,ye,we[Z].data);for(let oe=0;oe<K.length;oe++){const pe=K[oe].image[Z].image;We?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe+1,0,0,pe.width,pe.height,De,ye,pe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe+1,Ye,pe.width,pe.height,0,De,ye,pe.data)}}else{We?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,De,ye,we[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ye,De,ye,we[Z]);for(let oe=0;oe<K.length;oe++){const ee=K[oe];We?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe+1,0,0,De,ye,ee.image[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,oe+1,Ye,De,ye,ee.image[Z])}}}g(M)&&p(n.TEXTURE_CUBE_MAP),ie.__version=ne.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function te(T,M,j,Q,ne,ie){const Le=o.convert(j.format,j.colorSpace),he=o.convert(j.type),de=_(j.internalFormat,Le,he,j.colorSpace);if(!i.get(M).__hasExternalTextures){const se=Math.max(1,M.width>>ie),we=Math.max(1,M.height>>ie);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,ie,de,se,we,M.depth,0,Le,he,null):t.texImage2D(ne,ie,de,se,we,0,Le,he,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),Xe(M)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,ne,i.get(j).__webglTexture,0,ge(M)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,ne,i.get(j).__webglTexture,ie),t.bindFramebuffer(n.FRAMEBUFFER,null)}function re(T,M,j){if(n.bindRenderbuffer(n.RENDERBUFFER,T),M.depthBuffer){const Q=M.depthTexture,ne=Q&&Q.isDepthTexture?Q.type:null,ie=v(M.stencilBuffer,ne),Le=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=ge(M);Xe(M)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,he,ie,M.width,M.height):j?n.renderbufferStorageMultisample(n.RENDERBUFFER,he,ie,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ie,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Le,n.RENDERBUFFER,T)}else{const Q=M.textures;for(let ne=0;ne<Q.length;ne++){const ie=Q[ne],Le=o.convert(ie.format,ie.colorSpace),he=o.convert(ie.type),de=_(ie.internalFormat,Le,he,ie.colorSpace),Be=ge(M);j&&Xe(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Be,de,M.width,M.height):Xe(M)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Be,de,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,de,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function O(T,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),G(M.depthTexture,0);const Q=i.get(M.depthTexture).__webglTexture,ne=ge(M);if(M.depthTexture.format===Es)Xe(M)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(M.depthTexture.format===Ns)Xe(M)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function fe(T){const M=i.get(T),j=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!M.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");O(M.__webglFramebuffer,T)}else if(j){M.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[Q]),M.__webglDepthbuffer[Q]=n.createRenderbuffer(),re(M.__webglDepthbuffer[Q],T,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=n.createRenderbuffer(),re(M.__webglDepthbuffer,T,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Me(T,M,j){const Q=i.get(T);M!==void 0&&te(Q.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),j!==void 0&&fe(T)}function Ie(T){const M=T.texture,j=i.get(T),Q=i.get(M);T.addEventListener("dispose",C);const ne=T.textures,ie=T.isWebGLCubeRenderTarget===!0,Le=ne.length>1;if(Le||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=M.version,a.memory.textures++),ie){j.__webglFramebuffer=[];for(let he=0;he<6;he++)if(M.mipmaps&&M.mipmaps.length>0){j.__webglFramebuffer[he]=[];for(let de=0;de<M.mipmaps.length;de++)j.__webglFramebuffer[he][de]=n.createFramebuffer()}else j.__webglFramebuffer[he]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){j.__webglFramebuffer=[];for(let he=0;he<M.mipmaps.length;he++)j.__webglFramebuffer[he]=n.createFramebuffer()}else j.__webglFramebuffer=n.createFramebuffer();if(Le)for(let he=0,de=ne.length;he<de;he++){const Be=i.get(ne[he]);Be.__webglTexture===void 0&&(Be.__webglTexture=n.createTexture(),a.memory.textures++)}if(T.samples>0&&Xe(T)===!1){j.__webglMultisampledFramebuffer=n.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let he=0;he<ne.length;he++){const de=ne[he];j.__webglColorRenderbuffer[he]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,j.__webglColorRenderbuffer[he]);const Be=o.convert(de.format,de.colorSpace),se=o.convert(de.type),we=_(de.internalFormat,Be,se,de.colorSpace,T.isXRRenderTarget===!0),Je=ge(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,Je,we,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,j.__webglColorRenderbuffer[he])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(j.__webglDepthRenderbuffer=n.createRenderbuffer(),re(j.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ie){t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),ue(n.TEXTURE_CUBE_MAP,M);for(let he=0;he<6;he++)if(M.mipmaps&&M.mipmaps.length>0)for(let de=0;de<M.mipmaps.length;de++)te(j.__webglFramebuffer[he][de],T,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,de);else te(j.__webglFramebuffer[he],T,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);g(M)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Le){for(let he=0,de=ne.length;he<de;he++){const Be=ne[he],se=i.get(Be);t.bindTexture(n.TEXTURE_2D,se.__webglTexture),ue(n.TEXTURE_2D,Be),te(j.__webglFramebuffer,T,Be,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,0),g(Be)&&p(n.TEXTURE_2D)}t.unbindTexture()}else{let he=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(he=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,Q.__webglTexture),ue(he,M),M.mipmaps&&M.mipmaps.length>0)for(let de=0;de<M.mipmaps.length;de++)te(j.__webglFramebuffer[de],T,M,n.COLOR_ATTACHMENT0,he,de);else te(j.__webglFramebuffer,T,M,n.COLOR_ATTACHMENT0,he,0);g(M)&&p(he),t.unbindTexture()}T.depthBuffer&&fe(T)}function L(T){const M=T.textures;for(let j=0,Q=M.length;j<Q;j++){const ne=M[j];if(g(ne)){const ie=T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Le=i.get(ne).__webglTexture;t.bindTexture(ie,Le),p(ie),t.unbindTexture()}}}const Ge=[],Ce=[];function Ne(T){if(T.samples>0){if(Xe(T)===!1){const M=T.textures,j=T.width,Q=T.height;let ne=n.COLOR_BUFFER_BIT;const ie=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Le=i.get(T),he=M.length>1;if(he)for(let de=0;de<M.length;de++)t.bindFramebuffer(n.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Le.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Le.__webglFramebuffer);for(let de=0;de<M.length;de++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),he){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Le.__webglColorRenderbuffer[de]);const Be=i.get(M[de]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Be,0)}n.blitFramebuffer(0,0,j,Q,0,0,j,Q,ne,n.NEAREST),c===!0&&(Ge.length=0,Ce.length=0,Ge.push(n.COLOR_ATTACHMENT0+de),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Ge.push(ie),Ce.push(ie),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ce)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ge))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),he)for(let de=0;de<M.length;de++){t.bindFramebuffer(n.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,Le.__webglColorRenderbuffer[de]);const Be=i.get(M[de]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,Be,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Le.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const M=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function ge(T){return Math.min(s.maxSamples,T.samples)}function Xe(T){const M=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function ve(T){const M=a.render.frame;l.get(T)!==M&&(l.set(T,M),T.update())}function be(T,M){const j=T.colorSpace,Q=T.format,ne=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||j!==Si&&j!==fi&&(dt.getTransfer(j)===St?(Q!==Un||ne!==_i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),M}function je(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(u.width=T.naturalWidth||T.width,u.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(u.width=T.displayWidth,u.height=T.displayHeight):(u.width=T.width,u.height=T.height),u}this.allocateTextureUnit=N,this.resetTextureUnits=R,this.setTexture2D=G,this.setTexture2DArray=X,this.setTexture3D=Y,this.setTextureCube=J,this.rebindTextures=Me,this.setupRenderTarget=Ie,this.updateRenderTargetMipmap=L,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=fe,this.setupFrameBufferTexture=te,this.useMultisampledRTT=Xe}function vx(n,e){function t(i,s=fi){let o;const a=dt.getTransfer(s);if(i===_i)return n.UNSIGNED_BYTE;if(i===md)return n.UNSIGNED_SHORT_4_4_4_4;if(i===gd)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Vh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===kh)return n.BYTE;if(i===zh)return n.SHORT;if(i===la)return n.UNSIGNED_SHORT;if(i===pd)return n.INT;if(i===Us)return n.UNSIGNED_INT;if(i===Jn)return n.FLOAT;if(i===qi)return n.HALF_FLOAT;if(i===Hh)return n.ALPHA;if(i===Gh)return n.RGB;if(i===Un)return n.RGBA;if(i===jh)return n.LUMINANCE;if(i===Wh)return n.LUMINANCE_ALPHA;if(i===Es)return n.DEPTH_COMPONENT;if(i===Ns)return n.DEPTH_STENCIL;if(i===xd)return n.RED;if(i===yd)return n.RED_INTEGER;if(i===$h)return n.RG;if(i===vd)return n.RG_INTEGER;if(i===_d)return n.RGBA_INTEGER;if(i===Ua||i===Fa||i===Na||i===Oa)if(a===St)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Ua)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Fa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Na)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Oa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Ua)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Fa)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Na)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Oa)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===gl||i===xl||i===yl||i===vl)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===gl)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===xl)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===yl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===vl)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_l||i===Sl||i===Ml)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(i===_l||i===Sl)return a===St?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===Ml)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===bl||i===wl||i===El||i===Cl||i===Tl||i===Al||i===Rl||i===Pl||i===Ll||i===Il||i===Dl||i===Ul||i===Fl||i===Nl)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(i===bl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===wl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===El)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Cl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Tl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Al)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Rl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Pl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ll)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Il)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Dl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ul)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Fl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Nl)return a===St?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ba||i===Ol||i===Bl)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(i===Ba)return a===St?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ol)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Bl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===qh||i===kl||i===zl||i===Vl)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(i===Ba)return o.COMPRESSED_RED_RGTC1_EXT;if(i===kl)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===zl)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Vl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Fs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class _x extends un{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ws extends Lt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Sx={type:"move"};class cr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ws,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ws,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ws,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,o=null,a=null;const r=this._targetRay,c=this._grip,u=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(u&&e.hand){a=!0;for(const y of e.hand.values()){const g=t.getJointPose(y,i),p=this._getHandJoint(u,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const l=u.joints["index-finger-tip"],h=u.joints["thumb-tip"],f=l.position.distanceTo(h.position),m=.02,x=.005;u.inputState.pinching&&f>m+x?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&f<=m-x&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(o=t.getPose(e.gripSpace,i),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Sx)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=o!==null),u!==null&&(u.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ws;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Mx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class wx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const s=new Ot,o=e.properties.get(s);o.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new fn({vertexShader:Mx,fragmentShader:bx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Pt(new bi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class Ex extends ks{constructor(e,t){super();const i=this;let s=null,o=1,a=null,r="local-floor",c=1,u=null,l=null,h=null,f=null,m=null,x=null;const y=new wx,g=t.getContextAttributes();let p=null,_=null;const v=[],b=[],P=new Ke;let C=null;const A=new un;A.layers.enable(1),A.viewport=new Nt;const F=new un;F.layers.enable(2),F.viewport=new Nt;const w=[A,F],S=new _x;S.layers.enable(1),S.layers.enable(2);let R=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let te=v[q];return te===void 0&&(te=new cr,v[q]=te),te.getTargetRaySpace()},this.getControllerGrip=function(q){let te=v[q];return te===void 0&&(te=new cr,v[q]=te),te.getGripSpace()},this.getHand=function(q){let te=v[q];return te===void 0&&(te=new cr,v[q]=te),te.getHandSpace()};function k(q){const te=b.indexOf(q.inputSource);if(te===-1)return;const re=v[te];re!==void 0&&(re.update(q.inputSource,q.frame,u||a),re.dispatchEvent({type:q.type,data:q.inputSource}))}function G(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",X);for(let q=0;q<v.length;q++){const te=b[q];te!==null&&(b[q]=null,v[q].disconnect(te))}R=null,N=null,y.reset(),e.setRenderTarget(p),m=null,f=null,h=null,s=null,_=null,He.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){o=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){r=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||a},this.setReferenceSpace=function(q){u=q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",G),s.addEventListener("inputsourceschange",X),g.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(P),s.renderState.layers===void 0){const te={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:o};m=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new wn(m.framebufferWidth,m.framebufferHeight,{format:Un,type:_i,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let te=null,re=null,O=null;g.depth&&(O=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=g.stencil?Ns:Es,re=g.stencil?Fs:Us);const fe={colorFormat:t.RGBA8,depthFormat:O,scaleFactor:o};h=new XRWebGLBinding(s,t),f=h.createProjectionLayer(fe),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new wn(f.textureWidth,f.textureHeight,{format:Un,type:_i,depthTexture:new Fd(f.textureWidth,f.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),u=null,a=await s.requestReferenceSpace(r),He.setContext(s),He.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function X(q){for(let te=0;te<q.removed.length;te++){const re=q.removed[te],O=b.indexOf(re);O>=0&&(b[O]=null,v[O].disconnect(re))}for(let te=0;te<q.added.length;te++){const re=q.added[te];let O=b.indexOf(re);if(O===-1){for(let Me=0;Me<v.length;Me++)if(Me>=b.length){b.push(re),O=Me;break}else if(b[Me]===null){b[Me]=re,O=Me;break}if(O===-1)break}const fe=v[O];fe&&fe.connect(re)}}const Y=new U,J=new U;function V(q,te,re){Y.setFromMatrixPosition(te.matrixWorld),J.setFromMatrixPosition(re.matrixWorld);const O=Y.distanceTo(J),fe=te.projectionMatrix.elements,Me=re.projectionMatrix.elements,Ie=fe[14]/(fe[10]-1),L=fe[14]/(fe[10]+1),Ge=(fe[9]+1)/fe[5],Ce=(fe[9]-1)/fe[5],Ne=(fe[8]-1)/fe[0],ge=(Me[8]+1)/Me[0],Xe=Ie*Ne,ve=Ie*ge,be=O/(-Ne+ge),je=be*-Ne;te.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(je),q.translateZ(be),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert();const T=Ie+be,M=L+be,j=Xe-je,Q=ve+(O-je),ne=Ge*L/M*T,ie=Ce*L/M*T;q.projectionMatrix.makePerspective(j,Q,ne,ie,T,M),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}function ae(q,te){te===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(te.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;y.texture!==null&&(q.near=y.depthNear,q.far=y.depthFar),S.near=F.near=A.near=q.near,S.far=F.far=A.far=q.far,(R!==S.near||N!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),R=S.near,N=S.far,A.near=R,A.far=N,F.near=R,F.far=N,A.updateProjectionMatrix(),F.updateProjectionMatrix(),q.updateProjectionMatrix());const te=q.parent,re=S.cameras;ae(S,te);for(let O=0;O<re.length;O++)ae(re[O],te);re.length===2?V(S,A,F):S.projectionMatrix.copy(A.projectionMatrix),ce(q,S,te)};function ce(q,te,re){re===null?q.matrix.copy(te.matrixWorld):(q.matrix.copy(re.matrixWorld),q.matrix.invert(),q.matrix.multiply(te.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(te.projectionMatrix),q.projectionMatrixInverse.copy(te.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=uo*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(q){c=q,f!==null&&(f.fixedFoveation=q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=q)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(S)};let ue=null;function Fe(q,te){if(l=te.getViewerPose(u||a),x=te,l!==null){const re=l.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let O=!1;re.length!==S.cameras.length&&(S.cameras.length=0,O=!0);for(let Me=0;Me<re.length;Me++){const Ie=re[Me];let L=null;if(m!==null)L=m.getViewport(Ie);else{const Ce=h.getViewSubImage(f,Ie);L=Ce.viewport,Me===0&&(e.setRenderTargetTextures(_,Ce.colorTexture,f.ignoreDepthValues?void 0:Ce.depthStencilTexture),e.setRenderTarget(_))}let Ge=w[Me];Ge===void 0&&(Ge=new un,Ge.layers.enable(Me),Ge.viewport=new Nt,w[Me]=Ge),Ge.matrix.fromArray(Ie.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(Ie.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(L.x,L.y,L.width,L.height),Me===0&&(S.matrix.copy(Ge.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),O===!0&&S.cameras.push(Ge)}const fe=s.enabledFeatures;if(fe&&fe.includes("depth-sensing")){const Me=h.getDepthInformation(re[0]);Me&&Me.isValid&&Me.texture&&y.init(e,Me,s.renderState)}}for(let re=0;re<v.length;re++){const O=b[re],fe=v[re];O!==null&&fe!==void 0&&fe.update(O,te,u||a)}ue&&ue(q,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),x=null}const He=new Ud;He.setAnimationLoop(Fe),this.setAnimationLoop=function(q){ue=q},this.dispose=function(){}}}const Ii=new Nn,Cx=new gt;function Tx(n,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Ld(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,_,v,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(g,p):p.isMeshToonMaterial?(o(g,p),h(g,p)):p.isMeshPhongMaterial?(o(g,p),l(g,p)):p.isMeshStandardMaterial?(o(g,p),f(g,p),p.isMeshPhysicalMaterial&&m(g,p,b)):p.isMeshMatcapMaterial?(o(g,p),x(g,p)):p.isMeshDepthMaterial?o(g,p):p.isMeshDistanceMaterial?(o(g,p),y(g,p)):p.isMeshNormalMaterial?o(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?c(g,p,_,v):p.isSpriteMaterial?u(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Qt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Qt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=e.get(p),v=_.envMap,b=_.envMapRotation;v&&(g.envMap.value=v,Ii.copy(b),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),g.envMapRotation.value.setFromMatrix4(Cx.makeRotationFromEuler(Ii)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,_,v){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=v*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function h(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function m(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Qt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){const _=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Ax(n,e,t,i){let s={},o={},a=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,v){const b=v.program;i.uniformBlockBinding(_,b)}function u(_,v){let b=s[_.id];b===void 0&&(x(_),b=l(_),s[_.id]=b,_.addEventListener("dispose",g));const P=v.program;i.updateUBOMapping(_,P);const C=e.render.frame;o[_.id]!==C&&(f(_),o[_.id]=C)}function l(_){const v=h();_.__bindingPointIndex=v;const b=n.createBuffer(),P=_.__size,C=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,P,C),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,b),b}function h(){for(let _=0;_<r;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const v=s[_.id],b=_.uniforms,P=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let C=0,A=b.length;C<A;C++){const F=Array.isArray(b[C])?b[C]:[b[C]];for(let w=0,S=F.length;w<S;w++){const R=F[w];if(m(R,C,w,P)===!0){const N=R.__offset,k=Array.isArray(R.value)?R.value:[R.value];let G=0;for(let X=0;X<k.length;X++){const Y=k[X],J=y(Y);typeof Y=="number"||typeof Y=="boolean"?(R.__data[0]=Y,n.bufferSubData(n.UNIFORM_BUFFER,N+G,R.__data)):Y.isMatrix3?(R.__data[0]=Y.elements[0],R.__data[1]=Y.elements[1],R.__data[2]=Y.elements[2],R.__data[3]=0,R.__data[4]=Y.elements[3],R.__data[5]=Y.elements[4],R.__data[6]=Y.elements[5],R.__data[7]=0,R.__data[8]=Y.elements[6],R.__data[9]=Y.elements[7],R.__data[10]=Y.elements[8],R.__data[11]=0):(Y.toArray(R.__data,G),G+=J.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,N,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(_,v,b,P){const C=_.value,A=v+"_"+b;if(P[A]===void 0)return typeof C=="number"||typeof C=="boolean"?P[A]=C:P[A]=C.clone(),!0;{const F=P[A];if(typeof C=="number"||typeof C=="boolean"){if(F!==C)return P[A]=C,!0}else if(F.equals(C)===!1)return F.copy(C),!0}return!1}function x(_){const v=_.uniforms;let b=0;const P=16;for(let A=0,F=v.length;A<F;A++){const w=Array.isArray(v[A])?v[A]:[v[A]];for(let S=0,R=w.length;S<R;S++){const N=w[S],k=Array.isArray(N.value)?N.value:[N.value];for(let G=0,X=k.length;G<X;G++){const Y=k[G],J=y(Y),V=b%P;V!==0&&P-V<J.boundary&&(b+=P-V),N.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=b,b+=J.storage}}}const C=b%P;return C>0&&(b+=P-C),_.__size=b,_.__cache={},this}function y(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function g(_){const v=_.target;v.removeEventListener("dispose",g);const b=a.indexOf(v.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete o[v.id]}function p(){for(const _ in s)n.deleteBuffer(s[_]);a=[],s={},o={}}return{bind:c,update:u,dispose:p}}class Rx{constructor(e={}){const{canvas:t=Mf(),context:i=null,depth:s=!0,stencil:o=!1,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:u=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const m=new Uint32Array(4),x=new Int32Array(4);let y=null,g=null;const p=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ln,this.toneMapping=yi,this.toneMappingExposure=1;const v=this;let b=!1,P=0,C=0,A=null,F=-1,w=null;const S=new Nt,R=new Nt;let N=null;const k=new tt(0);let G=0,X=t.width,Y=t.height,J=1,V=null,ae=null;const ce=new Nt(0,0,X,Y),ue=new Nt(0,0,X,Y);let Fe=!1;const He=new Or;let q=!1,te=!1;const re=new gt,O=new U,fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Me=!1;function Ie(){return A===null?J:1}let L=i;function Ge(E,B){return t.getContext(E,B)}try{const E={alpha:!0,depth:s,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:u,powerPreference:l,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ir}`),t.addEventListener("webglcontextlost",me,!1),t.addEventListener("webglcontextrestored",K,!1),t.addEventListener("webglcontextcreationerror",Z,!1),L===null){const B="webgl2";if(L=Ge(B,E),L===null)throw Ge(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ce,Ne,ge,Xe,ve,be,je,T,M,j,Q,ne,ie,Le,he,de,Be,se,we,Je,De,ye,Ye,We;function ut(){Ce=new Og(L),Ce.init(),ye=new vx(L,Ce),Ne=new Lg(L,Ce,e,ye),ge=new xx(L),Xe=new zg(L),ve=new ix,be=new yx(L,Ce,ge,ve,Ne,ye,Xe),je=new Dg(v),T=new Ng(v),M=new qf(L),Ye=new Rg(L,M),j=new Bg(L,M,Xe,Ye),Q=new Hg(L,j,M,Xe),we=new Vg(L,Ne,be),de=new Ig(ve),ne=new nx(v,je,T,Ce,Ne,Ye,de),ie=new Tx(v,ve),Le=new ox,he=new ux(Ce),se=new Ag(v,je,T,ge,Q,f,c),Be=new gx(v,Q,Ne),We=new Ax(L,Xe,Ne,ge),Je=new Pg(L,Ce,Xe),De=new kg(L,Ce,Xe),Xe.programs=ne.programs,v.capabilities=Ne,v.extensions=Ce,v.properties=ve,v.renderLists=Le,v.shadowMap=Be,v.state=ge,v.info=Xe}ut();const I=new Ex(v,L);this.xr=I,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=Ce.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ce.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(E){E!==void 0&&(J=E,this.setSize(X,Y,!1))},this.getSize=function(E){return E.set(X,Y)},this.setSize=function(E,B,H=!0){if(I.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=E,Y=B,t.width=Math.floor(E*J),t.height=Math.floor(B*J),H===!0&&(t.style.width=E+"px",t.style.height=B+"px"),this.setViewport(0,0,E,B)},this.getDrawingBufferSize=function(E){return E.set(X*J,Y*J).floor()},this.setDrawingBufferSize=function(E,B,H){X=E,Y=B,J=H,t.width=Math.floor(E*H),t.height=Math.floor(B*H),this.setViewport(0,0,E,B)},this.getCurrentViewport=function(E){return E.copy(S)},this.getViewport=function(E){return E.copy(ce)},this.setViewport=function(E,B,H,$){E.isVector4?ce.set(E.x,E.y,E.z,E.w):ce.set(E,B,H,$),ge.viewport(S.copy(ce).multiplyScalar(J).round())},this.getScissor=function(E){return E.copy(ue)},this.setScissor=function(E,B,H,$){E.isVector4?ue.set(E.x,E.y,E.z,E.w):ue.set(E,B,H,$),ge.scissor(R.copy(ue).multiplyScalar(J).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(E){ge.setScissorTest(Fe=E)},this.setOpaqueSort=function(E){V=E},this.setTransparentSort=function(E){ae=E},this.getClearColor=function(E){return E.copy(se.getClearColor())},this.setClearColor=function(){se.setClearColor.apply(se,arguments)},this.getClearAlpha=function(){return se.getClearAlpha()},this.setClearAlpha=function(){se.setClearAlpha.apply(se,arguments)},this.clear=function(E=!0,B=!0,H=!0){let $=0;if(E){let z=!1;if(A!==null){const le=A.texture.format;z=le===_d||le===vd||le===yd}if(z){const le=A.texture.type,Se=le===_i||le===Us||le===la||le===Fs||le===md||le===gd,Ee=se.getClearColor(),Re=se.getClearAlpha(),ke=Ee.r,$e=Ee.g,Oe=Ee.b;Se?(m[0]=ke,m[1]=$e,m[2]=Oe,m[3]=Re,L.clearBufferuiv(L.COLOR,0,m)):(x[0]=ke,x[1]=$e,x[2]=Oe,x[3]=Re,L.clearBufferiv(L.COLOR,0,x))}else $|=L.COLOR_BUFFER_BIT}B&&($|=L.DEPTH_BUFFER_BIT),H&&($|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",K,!1),t.removeEventListener("webglcontextcreationerror",Z,!1),Le.dispose(),he.dispose(),ve.dispose(),je.dispose(),T.dispose(),Q.dispose(),Ye.dispose(),We.dispose(),ne.dispose(),I.dispose(),I.removeEventListener("sessionstart",ht),I.removeEventListener("sessionend",yt),Et.stop()};function me(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function K(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const E=Xe.autoReset,B=Be.enabled,H=Be.autoUpdate,$=Be.needsUpdate,z=Be.type;ut(),Xe.autoReset=E,Be.enabled=B,Be.autoUpdate=H,Be.needsUpdate=$,Be.type=z}function Z(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function oe(E){const B=E.target;B.removeEventListener("dispose",oe),ee(B)}function ee(E){pe(E),ve.remove(E)}function pe(E){const B=ve.get(E).programs;B!==void 0&&(B.forEach(function(H){ne.releaseProgram(H)}),E.isShaderMaterial&&ne.releaseShaderCache(E))}this.renderBufferDirect=function(E,B,H,$,z,le){B===null&&(B=fe);const Se=z.isMesh&&z.matrixWorld.determinant()<0,Ee=ii(E,B,H,$,z);ge.setMaterial($,Se);let Re=H.index,ke=1;if($.wireframe===!0){if(Re=j.getWireframeAttribute(H),Re===void 0)return;ke=2}const $e=H.drawRange,Oe=H.attributes.position;let nt=$e.start*ke,xt=($e.start+$e.count)*ke;le!==null&&(nt=Math.max(nt,le.start*ke),xt=Math.min(xt,(le.start+le.count)*ke)),Re!==null?(nt=Math.max(nt,0),xt=Math.min(xt,Re.count)):Oe!=null&&(nt=Math.max(nt,0),xt=Math.min(xt,Oe.count));const vt=xt-nt;if(vt<0||vt===1/0)return;Ye.setup(z,$,Ee,H,Re);let Bt,it=Je;if(Re!==null&&(Bt=M.get(Re),it=De,it.setIndex(Bt)),z.isMesh)$.wireframe===!0?(ge.setLineWidth($.wireframeLinewidth*Ie()),it.setMode(L.LINES)):it.setMode(L.TRIANGLES);else if(z.isLine){let Ue=$.linewidth;Ue===void 0&&(Ue=1),ge.setLineWidth(Ue*Ie()),z.isLineSegments?it.setMode(L.LINES):z.isLineLoop?it.setMode(L.LINE_LOOP):it.setMode(L.LINE_STRIP)}else z.isPoints?it.setMode(L.POINTS):z.isSprite&&it.setMode(L.TRIANGLES);if(z.isBatchedMesh)z._multiDrawInstances!==null?it.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances):it.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else if(z.isInstancedMesh)it.renderInstances(nt,vt,z.count);else if(H.isInstancedBufferGeometry){const Ue=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,At=Math.min(H.instanceCount,Ue);it.renderInstances(nt,vt,At)}else it.render(nt,vt)};function Te(E,B,H){E.transparent===!0&&E.side===hn&&E.forceSinglePass===!1?(E.side=Qt,E.needsUpdate=!0,Bn(E,B,H),E.side=Fn,E.needsUpdate=!0,Bn(E,B,H),E.side=hn):Bn(E,B,H)}this.compile=function(E,B,H=null){H===null&&(H=E),g=he.get(H),g.init(B),_.push(g),H.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(g.pushLight(z),z.castShadow&&g.pushShadow(z))}),E!==H&&E.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(g.pushLight(z),z.castShadow&&g.pushShadow(z))}),g.setupLights();const $=new Set;return E.traverse(function(z){const le=z.material;if(le)if(Array.isArray(le))for(let Se=0;Se<le.length;Se++){const Ee=le[Se];Te(Ee,H,z),$.add(Ee)}else Te(le,H,z),$.add(le)}),_.pop(),g=null,$},this.compileAsync=function(E,B,H=null){const $=this.compile(E,B,H);return new Promise(z=>{function le(){if($.forEach(function(Se){ve.get(Se).currentProgram.isReady()&&$.delete(Se)}),$.size===0){z(E);return}setTimeout(le,10)}Ce.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let Ae=null;function Ve(E){Ae&&Ae(E)}function ht(){Et.stop()}function yt(){Et.start()}const Et=new Ud;Et.setAnimationLoop(Ve),typeof self<"u"&&Et.setContext(self),this.setAnimationLoop=function(E){Ae=E,I.setAnimationLoop(E),E===null?Et.stop():Et.start()},I.addEventListener("sessionstart",ht),I.addEventListener("sessionend",yt),this.render=function(E,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),I.enabled===!0&&I.isPresenting===!0&&(I.cameraAutoUpdate===!0&&I.updateCamera(B),B=I.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,B,A),g=he.get(E,_.length),g.init(B),_.push(g),re.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),He.setFromProjectionMatrix(re),te=this.localClippingEnabled,q=de.init(this.clippingPlanes,te),y=Le.get(E,p.length),y.init(),p.push(y),I.enabled===!0&&I.isPresenting===!0){const le=v.xr.getDepthSensingMesh();le!==null&&tn(le,B,-1/0,v.sortObjects)}tn(E,B,0,v.sortObjects),y.finish(),v.sortObjects===!0&&y.sort(V,ae),Me=I.enabled===!1||I.isPresenting===!1||I.hasDepthSensing()===!1,Me&&se.addToRenderList(y,E),this.info.render.frame++,q===!0&&de.beginShadows();const H=g.state.shadowsArray;Be.render(H,E,B),q===!0&&de.endShadows(),this.info.autoReset===!0&&this.info.reset();const $=y.opaque,z=y.transmissive;if(g.setupLights(),B.isArrayCamera){const le=B.cameras;if(z.length>0)for(let Se=0,Ee=le.length;Se<Ee;Se++){const Re=le[Se];Cn($,z,E,Re)}Me&&se.render(E);for(let Se=0,Ee=le.length;Se<Ee;Se++){const Re=le[Se];on(y,E,Re,Re.viewport)}}else z.length>0&&Cn($,z,E,B),Me&&se.render(E),on(y,E,B);A!==null&&(be.updateMultisampleRenderTarget(A),be.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(v,E,B),Ye.resetDefaultState(),F=-1,w=null,_.pop(),_.length>0?(g=_[_.length-1],q===!0&&de.setGlobalState(v.clippingPlanes,g.state.camera)):g=null,p.pop(),p.length>0?y=p[p.length-1]:y=null};function tn(E,B,H,$){if(E.visible===!1)return;if(E.layers.test(B.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(B);else if(E.isLight)g.pushLight(E),E.castShadow&&g.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||He.intersectsSprite(E)){$&&O.setFromMatrixPosition(E.matrixWorld).applyMatrix4(re);const Se=Q.update(E),Ee=E.material;Ee.visible&&y.push(E,Se,Ee,H,O.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||He.intersectsObject(E))){const Se=Q.update(E),Ee=E.material;if($&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),O.copy(E.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),O.copy(Se.boundingSphere.center)),O.applyMatrix4(E.matrixWorld).applyMatrix4(re)),Array.isArray(Ee)){const Re=Se.groups;for(let ke=0,$e=Re.length;ke<$e;ke++){const Oe=Re[ke],nt=Ee[Oe.materialIndex];nt&&nt.visible&&y.push(E,Se,nt,H,O.z,Oe)}}else Ee.visible&&y.push(E,Se,Ee,H,O.z,null)}}const le=E.children;for(let Se=0,Ee=le.length;Se<Ee;Se++)tn(le[Se],B,H,$)}function on(E,B,H,$){const z=E.opaque,le=E.transmissive,Se=E.transparent;g.setupLightsView(H),q===!0&&de.setGlobalState(v.clippingPlanes,H),$&&ge.viewport(S.copy($)),z.length>0&&On(z,B,H),le.length>0&&On(le,B,H),Se.length>0&&On(Se,B,H),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Cn(E,B,H,$){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[$.id]===void 0&&(g.state.transmissionRenderTarget[$.id]=new wn(1,1,{generateMipmaps:!0,type:Ce.has("EXT_color_buffer_half_float")||Ce.has("EXT_color_buffer_float")?qi:_i,minFilter:Vi,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:dt.workingColorSpace}));const le=g.state.transmissionRenderTarget[$.id],Se=$.viewport||S;le.setSize(Se.z,Se.w);const Ee=v.getRenderTarget();v.setRenderTarget(le),v.getClearColor(k),G=v.getClearAlpha(),G<1&&v.setClearColor(16777215,.5),Me?se.render(H):v.clear();const Re=v.toneMapping;v.toneMapping=yi;const ke=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),g.setupLightsView($),q===!0&&de.setGlobalState(v.clippingPlanes,$),On(E,H,$),be.updateMultisampleRenderTarget(le),be.updateRenderTargetMipmap(le),Ce.has("WEBGL_multisampled_render_to_texture")===!1){let $e=!1;for(let Oe=0,nt=B.length;Oe<nt;Oe++){const xt=B[Oe],vt=xt.object,Bt=xt.geometry,it=xt.material,Ue=xt.group;if(it.side===hn&&vt.layers.test($.layers)){const At=it.side;it.side=Qt,it.needsUpdate=!0,ni(vt,H,$,Bt,it,Ue),it.side=At,it.needsUpdate=!0,$e=!0}}$e===!0&&(be.updateMultisampleRenderTarget(le),be.updateRenderTargetMipmap(le))}v.setRenderTarget(Ee),v.setClearColor(k,G),ke!==void 0&&($.viewport=ke),v.toneMapping=Re}function On(E,B,H){const $=B.isScene===!0?B.overrideMaterial:null;for(let z=0,le=E.length;z<le;z++){const Se=E[z],Ee=Se.object,Re=Se.geometry,ke=$===null?Se.material:$,$e=Se.group;Ee.layers.test(H.layers)&&ni(Ee,B,H,Re,ke,$e)}}function ni(E,B,H,$,z,le){E.onBeforeRender(v,B,H,$,z,le),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),z.onBeforeRender(v,B,H,$,E,le),z.transparent===!0&&z.side===hn&&z.forceSinglePass===!1?(z.side=Qt,z.needsUpdate=!0,v.renderBufferDirect(H,B,$,z,E,le),z.side=Fn,z.needsUpdate=!0,v.renderBufferDirect(H,B,$,z,E,le),z.side=hn):v.renderBufferDirect(H,B,$,z,E,le),E.onAfterRender(v,B,H,$,z,le)}function Bn(E,B,H){B.isScene!==!0&&(B=fe);const $=ve.get(E),z=g.state.lights,le=g.state.shadowsArray,Se=z.state.version,Ee=ne.getParameters(E,z.state,le,B,H),Re=ne.getProgramCacheKey(Ee);let ke=$.programs;$.environment=E.isMeshStandardMaterial?B.environment:null,$.fog=B.fog,$.envMap=(E.isMeshStandardMaterial?T:je).get(E.envMap||$.environment),$.envMapRotation=$.environment!==null&&E.envMap===null?B.environmentRotation:E.envMapRotation,ke===void 0&&(E.addEventListener("dispose",oe),ke=new Map,$.programs=ke);let $e=ke.get(Re);if($e!==void 0){if($.currentProgram===$e&&$.lightsStateVersion===Se)return kn(E,Ee),$e}else Ee.uniforms=ne.getUniforms(E),E.onBuild(H,Ee,v),E.onBeforeCompile(Ee,v),$e=ne.acquireProgram(Ee,Re),ke.set(Re,$e),$.uniforms=Ee.uniforms;const Oe=$.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Oe.clippingPlanes=de.uniform),kn(E,Ee),$.needsLights=zn(E),$.lightsStateVersion=Se,$.needsLights&&(Oe.ambientLightColor.value=z.state.ambient,Oe.lightProbe.value=z.state.probe,Oe.directionalLights.value=z.state.directional,Oe.directionalLightShadows.value=z.state.directionalShadow,Oe.spotLights.value=z.state.spot,Oe.spotLightShadows.value=z.state.spotShadow,Oe.rectAreaLights.value=z.state.rectArea,Oe.ltc_1.value=z.state.rectAreaLTC1,Oe.ltc_2.value=z.state.rectAreaLTC2,Oe.pointLights.value=z.state.point,Oe.pointLightShadows.value=z.state.pointShadow,Oe.hemisphereLights.value=z.state.hemi,Oe.directionalShadowMap.value=z.state.directionalShadowMap,Oe.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Oe.spotShadowMap.value=z.state.spotShadowMap,Oe.spotLightMatrix.value=z.state.spotLightMatrix,Oe.spotLightMap.value=z.state.spotLightMap,Oe.pointShadowMap.value=z.state.pointShadowMap,Oe.pointShadowMatrix.value=z.state.pointShadowMatrix),$.currentProgram=$e,$.uniformsList=null,$e}function Zi(E){if(E.uniformsList===null){const B=E.currentProgram.getUniforms();E.uniformsList=oa.seqWithValue(B.seq,E.uniforms)}return E.uniformsList}function kn(E,B){const H=ve.get(E);H.outputColorSpace=B.outputColorSpace,H.batching=B.batching,H.batchingColor=B.batchingColor,H.instancing=B.instancing,H.instancingColor=B.instancingColor,H.instancingMorph=B.instancingMorph,H.skinning=B.skinning,H.morphTargets=B.morphTargets,H.morphNormals=B.morphNormals,H.morphColors=B.morphColors,H.morphTargetsCount=B.morphTargetsCount,H.numClippingPlanes=B.numClippingPlanes,H.numIntersection=B.numClipIntersection,H.vertexAlphas=B.vertexAlphas,H.vertexTangents=B.vertexTangents,H.toneMapping=B.toneMapping}function ii(E,B,H,$,z){B.isScene!==!0&&(B=fe),be.resetTextureUnits();const le=B.fog,Se=$.isMeshStandardMaterial?B.environment:null,Ee=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Si,Re=($.isMeshStandardMaterial?T:je).get($.envMap||Se),ke=$.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,$e=!!H.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Oe=!!H.morphAttributes.position,nt=!!H.morphAttributes.normal,xt=!!H.morphAttributes.color;let vt=yi;$.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(vt=v.toneMapping);const Bt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,it=Bt!==void 0?Bt.length:0,Ue=ve.get($),At=g.state.lights;if(q===!0&&(te===!0||E!==w)){const Yt=E===w&&$.id===F;de.setState($,E,Yt)}let rt=!1;$.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==At.state.version||Ue.outputColorSpace!==Ee||z.isBatchedMesh&&Ue.batching===!1||!z.isBatchedMesh&&Ue.batching===!0||z.isBatchedMesh&&Ue.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Ue.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Ue.instancing===!1||!z.isInstancedMesh&&Ue.instancing===!0||z.isSkinnedMesh&&Ue.skinning===!1||!z.isSkinnedMesh&&Ue.skinning===!0||z.isInstancedMesh&&Ue.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ue.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ue.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ue.instancingMorph===!1&&z.morphTexture!==null||Ue.envMap!==Re||$.fog===!0&&Ue.fog!==le||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==de.numPlanes||Ue.numIntersection!==de.numIntersection)||Ue.vertexAlphas!==ke||Ue.vertexTangents!==$e||Ue.morphTargets!==Oe||Ue.morphNormals!==nt||Ue.morphColors!==xt||Ue.toneMapping!==vt||Ue.morphTargetsCount!==it)&&(rt=!0):(rt=!0,Ue.__version=$.version);let an=Ue.currentProgram;rt===!0&&(an=Bn($,B,z));let wi=!1,Tn=!1,Qi=!1;const wt=an.getUniforms(),pn=Ue.uniforms;if(ge.useProgram(an.program)&&(wi=!0,Tn=!0,Qi=!0),$.id!==F&&(F=$.id,Tn=!0),wi||w!==E){wt.setValue(L,"projectionMatrix",E.projectionMatrix),wt.setValue(L,"viewMatrix",E.matrixWorldInverse);const Yt=wt.map.cameraPosition;Yt!==void 0&&Yt.setValue(L,O.setFromMatrixPosition(E.matrixWorld)),Ne.logarithmicDepthBuffer&&wt.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&wt.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),w!==E&&(w=E,Tn=!0,Qi=!0)}if(z.isSkinnedMesh){wt.setOptional(L,z,"bindMatrix"),wt.setOptional(L,z,"bindMatrixInverse");const Yt=z.skeleton;Yt&&(Yt.boneTexture===null&&Yt.computeBoneTexture(),wt.setValue(L,"boneTexture",Yt.boneTexture,be))}z.isBatchedMesh&&(wt.setOptional(L,z,"batchingTexture"),wt.setValue(L,"batchingTexture",z._matricesTexture,be),wt.setOptional(L,z,"batchingColorTexture"),z._colorsTexture!==null&&wt.setValue(L,"batchingColorTexture",z._colorsTexture,be));const Ei=H.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&we.update(z,H,an),(Tn||Ue.receiveShadow!==z.receiveShadow)&&(Ue.receiveShadow=z.receiveShadow,wt.setValue(L,"receiveShadow",z.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(pn.envMap.value=Re,pn.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&B.environment!==null&&(pn.envMapIntensity.value=B.environmentIntensity),Tn&&(wt.setValue(L,"toneMappingExposure",v.toneMappingExposure),Ue.needsLights&&si(pn,Qi),le&&$.fog===!0&&ie.refreshFogUniforms(pn,le),ie.refreshMaterialUniforms(pn,$,J,Y,g.state.transmissionRenderTarget[E.id]),oa.upload(L,Zi(Ue),pn,be)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(oa.upload(L,Zi(Ue),pn,be),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&wt.setValue(L,"center",z.center),wt.setValue(L,"modelViewMatrix",z.modelViewMatrix),wt.setValue(L,"normalMatrix",z.normalMatrix),wt.setValue(L,"modelMatrix",z.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const Yt=$.uniformsGroups;for(let Ws=0,D=Yt.length;Ws<D;Ws++){const _e=Yt[Ws];We.update(_e,an),We.bind(_e,an)}}return an}function si(E,B){E.ambientLightColor.needsUpdate=B,E.lightProbe.needsUpdate=B,E.directionalLights.needsUpdate=B,E.directionalLightShadows.needsUpdate=B,E.pointLights.needsUpdate=B,E.pointLightShadows.needsUpdate=B,E.spotLights.needsUpdate=B,E.spotLightShadows.needsUpdate=B,E.rectAreaLights.needsUpdate=B,E.hemisphereLights.needsUpdate=B}function zn(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,B,H){ve.get(E.texture).__webglTexture=B,ve.get(E.depthTexture).__webglTexture=H;const $=ve.get(E);$.__hasExternalTextures=!0,$.__autoAllocateDepthBuffer=H===void 0,$.__autoAllocateDepthBuffer||Ce.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,B){const H=ve.get(E);H.__webglFramebuffer=B,H.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(E,B=0,H=0){A=E,P=B,C=H;let $=!0,z=null,le=!1,Se=!1;if(E){const Re=ve.get(E);Re.__useDefaultFramebuffer!==void 0?(ge.bindFramebuffer(L.FRAMEBUFFER,null),$=!1):Re.__webglFramebuffer===void 0?be.setupRenderTarget(E):Re.__hasExternalTextures&&be.rebindTextures(E,ve.get(E.texture).__webglTexture,ve.get(E.depthTexture).__webglTexture);const ke=E.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(Se=!0);const $e=ve.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray($e[B])?z=$e[B][H]:z=$e[B],le=!0):E.samples>0&&be.useMultisampledRTT(E)===!1?z=ve.get(E).__webglMultisampledFramebuffer:Array.isArray($e)?z=$e[H]:z=$e,S.copy(E.viewport),R.copy(E.scissor),N=E.scissorTest}else S.copy(ce).multiplyScalar(J).floor(),R.copy(ue).multiplyScalar(J).floor(),N=Fe;if(ge.bindFramebuffer(L.FRAMEBUFFER,z)&&$&&ge.drawBuffers(E,z),ge.viewport(S),ge.scissor(R),ge.setScissorTest(N),le){const Re=ve.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+B,Re.__webglTexture,H)}else if(Se){const Re=ve.get(E.texture),ke=B||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Re.__webglTexture,H||0,ke)}F=-1},this.readRenderTargetPixels=function(E,B,H,$,z,le,Se){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=ve.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Se!==void 0&&(Ee=Ee[Se]),Ee){ge.bindFramebuffer(L.FRAMEBUFFER,Ee);try{const Re=E.texture,ke=Re.format,$e=Re.type;if(!Ne.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ne.textureTypeReadable($e)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=E.width-$&&H>=0&&H<=E.height-z&&L.readPixels(B,H,$,z,ye.convert(ke),ye.convert($e),le)}finally{const Re=A!==null?ve.get(A).__webglFramebuffer:null;ge.bindFramebuffer(L.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(E,B,H,$,z,le,Se){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=ve.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Se!==void 0&&(Ee=Ee[Se]),Ee){ge.bindFramebuffer(L.FRAMEBUFFER,Ee);try{const Re=E.texture,ke=Re.format,$e=Re.type;if(!Ne.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ne.textureTypeReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=E.width-$&&H>=0&&H<=E.height-z){const Oe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Oe),L.bufferData(L.PIXEL_PACK_BUFFER,le.byteLength,L.STREAM_READ),L.readPixels(B,H,$,z,ye.convert(ke),ye.convert($e),0),L.flush();const nt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);await bf(L,nt,4);try{L.bindBuffer(L.PIXEL_PACK_BUFFER,Oe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,le)}finally{L.deleteBuffer(Oe),L.deleteSync(nt)}return le}}finally{const Re=A!==null?ve.get(A).__webglFramebuffer:null;ge.bindFramebuffer(L.FRAMEBUFFER,Re)}}},this.copyFramebufferToTexture=function(E,B=null,H=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1]);const $=Math.pow(2,-H),z=Math.floor(E.image.width*$),le=Math.floor(E.image.height*$),Se=B!==null?B.x:0,Ee=B!==null?B.y:0;be.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,H,0,0,Se,Ee,z,le),ge.unbindTexture()},this.copyTextureToTexture=function(E,B,H=null,$=null,z=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),$=arguments[0]||null,E=arguments[1],B=arguments[2],z=arguments[3]||0,H=null);let le,Se,Ee,Re,ke,$e;H!==null?(le=H.max.x-H.min.x,Se=H.max.y-H.min.y,Ee=H.min.x,Re=H.min.y):(le=E.image.width,Se=E.image.height,Ee=0,Re=0),$!==null?(ke=$.x,$e=$.y):(ke=0,$e=0);const Oe=ye.convert(B.format),nt=ye.convert(B.type);be.setTexture2D(B,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,B.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,B.unpackAlignment);const xt=L.getParameter(L.UNPACK_ROW_LENGTH),vt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Bt=L.getParameter(L.UNPACK_SKIP_PIXELS),it=L.getParameter(L.UNPACK_SKIP_ROWS),Ue=L.getParameter(L.UNPACK_SKIP_IMAGES),At=E.isCompressedTexture?E.mipmaps[z]:E.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,At.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,At.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ee),L.pixelStorei(L.UNPACK_SKIP_ROWS,Re),E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,z,ke,$e,le,Se,Oe,nt,At.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,z,ke,$e,At.width,At.height,Oe,At.data):L.texSubImage2D(L.TEXTURE_2D,z,ke,$e,Oe,nt,At),L.pixelStorei(L.UNPACK_ROW_LENGTH,xt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,vt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Bt),L.pixelStorei(L.UNPACK_SKIP_ROWS,it),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ue),z===0&&B.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),ge.unbindTexture()},this.copyTextureToTexture3D=function(E,B,H=null,$=null,z=0){E.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,$=arguments[1]||null,E=arguments[2],B=arguments[3],z=arguments[4]||0);let le,Se,Ee,Re,ke,$e,Oe,nt,xt;const vt=E.isCompressedTexture?E.mipmaps[z]:E.image;H!==null?(le=H.max.x-H.min.x,Se=H.max.y-H.min.y,Ee=H.max.z-H.min.z,Re=H.min.x,ke=H.min.y,$e=H.min.z):(le=vt.width,Se=vt.height,Ee=vt.depth,Re=0,ke=0,$e=0),$!==null?(Oe=$.x,nt=$.y,xt=$.z):(Oe=0,nt=0,xt=0);const Bt=ye.convert(B.format),it=ye.convert(B.type);let Ue;if(B.isData3DTexture)be.setTexture3D(B,0),Ue=L.TEXTURE_3D;else if(B.isDataArrayTexture||B.isCompressedArrayTexture)be.setTexture2DArray(B,0),Ue=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,B.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,B.unpackAlignment);const At=L.getParameter(L.UNPACK_ROW_LENGTH),rt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),an=L.getParameter(L.UNPACK_SKIP_PIXELS),wi=L.getParameter(L.UNPACK_SKIP_ROWS),Tn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,vt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,vt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Re),L.pixelStorei(L.UNPACK_SKIP_ROWS,ke),L.pixelStorei(L.UNPACK_SKIP_IMAGES,$e),E.isDataTexture||E.isData3DTexture?L.texSubImage3D(Ue,z,Oe,nt,xt,le,Se,Ee,Bt,it,vt.data):B.isCompressedArrayTexture?L.compressedTexSubImage3D(Ue,z,Oe,nt,xt,le,Se,Ee,Bt,vt.data):L.texSubImage3D(Ue,z,Oe,nt,xt,le,Se,Ee,Bt,it,vt),L.pixelStorei(L.UNPACK_ROW_LENGTH,At),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,rt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,an),L.pixelStorei(L.UNPACK_SKIP_ROWS,wi),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Tn),z===0&&B.generateMipmaps&&L.generateMipmap(Ue),ge.unbindTexture()},this.initRenderTarget=function(E){ve.get(E).__webglFramebuffer===void 0&&be.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?be.setTextureCube(E,0):E.isData3DTexture?be.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?be.setTexture2DArray(E,0):be.setTexture2D(E,0),ge.unbindTexture()},this.resetState=function(){P=0,C=0,A=null,ge.reset(),Ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Dr?"display-p3":"srgb",t.unpackColorSpace=dt.workingColorSpace===ba?"display-p3":"srgb"}}class Px extends Lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nn,this.environmentIntensity=1,this.environmentRotation=new Nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Lx{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Cr,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Fr("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,o=this.stride;s<o;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Gt=new U;class fa{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Mn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ct(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Mn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Mn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Mn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Mn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),i=ct(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),i=ct(i,this.array),s=ct(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,o){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),i=ct(i,this.array),s=ct(s,this.array),o=ct(o,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=o,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let o=0;o<this.itemSize;o++)t.push(this.data.array[s+o])}return new en(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new fa(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let o=0;o<this.itemSize;o++)t.push(this.data.array[s+o])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class kr extends Xi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let xs;const Ks=new U,ys=new U,vs=new U,_s=new Ke,Js=new Ke,Vd=new gt,Go=new U,Zs=new U,jo=new U,Ic=new Ke,dr=new Ke,Dc=new Ke;class Hd extends Lt{constructor(e=new kr){if(super(),this.isSprite=!0,this.type="Sprite",xs===void 0){xs=new Xt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Lx(t,5);xs.setIndex([0,1,2,0,2,3]),xs.setAttribute("position",new fa(i,3,0,!1)),xs.setAttribute("uv",new fa(i,2,3,!1))}this.geometry=xs,this.material=e,this.center=new Ke(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ys.setFromMatrixScale(this.matrixWorld),Vd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),vs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ys.multiplyScalar(-vs.z);const i=this.material.rotation;let s,o;i!==0&&(o=Math.cos(i),s=Math.sin(i));const a=this.center;Wo(Go.set(-.5,-.5,0),vs,a,ys,s,o),Wo(Zs.set(.5,-.5,0),vs,a,ys,s,o),Wo(jo.set(.5,.5,0),vs,a,ys,s,o),Ic.set(0,0),dr.set(1,0),Dc.set(1,1);let r=e.ray.intersectTriangle(Go,Zs,jo,!1,Ks);if(r===null&&(Wo(Zs.set(-.5,.5,0),vs,a,ys,s,o),dr.set(0,1),r=e.ray.intersectTriangle(Go,jo,Zs,!1,Ks),r===null))return;const c=e.ray.origin.distanceTo(Ks);c<e.near||c>e.far||t.push({distance:c,point:Ks.clone(),uv:bn.getInterpolation(Ks,Go,Zs,jo,Ic,dr,Dc,new Ke),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Wo(n,e,t,i,s,o){_s.subVectors(n,t).addScalar(.5).multiply(i),s!==void 0?(Js.x=o*_s.x-s*_s.y,Js.y=s*_s.x+o*_s.y):Js.copy(_s),n.copy(e),n.x+=Js.x,n.y+=Js.y,n.applyMatrix4(Vd)}class Ix extends Ot{constructor(e=null,t=1,i=1,s,o,a,r,c,u=Ht,l=Ht,h,f){super(null,a,r,c,u,l,s,o,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pa extends en{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ss=new gt,Uc=new gt,$o=[],Fc=new Mi,Dx=new gt,Qs=new Pt,eo=new Vs;class Gd extends Pt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new pa(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Dx)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Mi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ss),Fc.copy(e.boundingBox).applyMatrix4(Ss),this.boundingBox.union(Fc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vs),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ss),eo.copy(e.boundingSphere).applyMatrix4(Ss),this.boundingSphere.union(eo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,o=i.length+1,a=e*o+1;for(let r=0;r<i.length;r++)i[r]=s[a+r]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Qs.geometry=this.geometry,Qs.material=this.material,Qs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),eo.copy(this.boundingSphere),eo.applyMatrix4(i),e.ray.intersectsSphere(eo)!==!1))for(let o=0;o<s;o++){this.getMatrixAt(o,Ss),Uc.multiplyMatrices(i,Ss),Qs.matrixWorld=Uc,Qs.raycast(e,$o);for(let a=0,r=$o.length;a<r;a++){const c=$o[a];c.instanceId=o,c.object=this,t.push(c)}$o.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new pa(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ix(new Float32Array(s*this.count),s,this.count,xd,Jn));const o=this.morphTexture.source.data.data;let a=0;for(let u=0;u<i.length;u++)a+=i[u];const r=this.geometry.morphTargetsRelative?1:1-a,c=s*e;o[c]=r,o.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class jd extends Xi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new tt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ma=new U,ga=new U,Nc=new gt,to=new Cd,qo=new Vs,ur=new U,Oc=new U;class Ux extends Lt{constructor(e=new Xt,t=new jd){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,o=t.count;s<o;s++)ma.fromBufferAttribute(t,s-1),ga.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=ma.distanceTo(ga);e.setAttribute("lineDistance",new mt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,o=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qo.copy(i.boundingSphere),qo.applyMatrix4(s),qo.radius+=o,e.ray.intersectsSphere(qo)===!1)return;Nc.copy(s).invert(),to.copy(e.ray).applyMatrix4(Nc);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,u=this.isLineSegments?2:1,l=i.index,f=i.attributes.position;if(l!==null){const m=Math.max(0,a.start),x=Math.min(l.count,a.start+a.count);for(let y=m,g=x-1;y<g;y+=u){const p=l.getX(y),_=l.getX(y+1),v=Xo(this,e,to,c,p,_);v&&t.push(v)}if(this.isLineLoop){const y=l.getX(x-1),g=l.getX(m),p=Xo(this,e,to,c,y,g);p&&t.push(p)}}else{const m=Math.max(0,a.start),x=Math.min(f.count,a.start+a.count);for(let y=m,g=x-1;y<g;y+=u){const p=Xo(this,e,to,c,y,y+1);p&&t.push(p)}if(this.isLineLoop){const y=Xo(this,e,to,c,x-1,m);y&&t.push(y)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function Xo(n,e,t,i,s,o){const a=n.geometry.attributes.position;if(ma.fromBufferAttribute(a,s),ga.fromBufferAttribute(a,o),t.distanceSqToSegment(ma,ga,ur,Oc)>i)return;ur.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(ur);if(!(c<e.near||c>e.far))return{distance:c,point:Oc.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,object:n}}const Bc=new U,kc=new U;class Fx extends Ux{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,o=t.count;s<o;s+=2)Bc.fromBufferAttribute(t,s),kc.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Bc.distanceTo(kc);e.setAttribute("lineDistance",new mt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class zr extends Xt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const o=[],a=[],r=[],c=[],u=new U,l=new Ke;a.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let h=0,f=3;h<=t;h++,f+=3){const m=i+h/t*s;u.x=e*Math.cos(m),u.y=e*Math.sin(m),a.push(u.x,u.y,u.z),r.push(0,0,1),l.x=(a[f]/e+1)/2,l.y=(a[f+1]/e+1)/2,c.push(l.x,l.y)}for(let h=1;h<=t;h++)o.push(h,h+1,0);this.setIndex(o),this.setAttribute("position",new mt(a,3)),this.setAttribute("normal",new mt(r,3)),this.setAttribute("uv",new mt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zr(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Vr extends Xt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const o=[],a=[];r(s),u(i),l(),this.setAttribute("position",new mt(o,3)),this.setAttribute("normal",new mt(o.slice(),3)),this.setAttribute("uv",new mt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(_){const v=new U,b=new U,P=new U;for(let C=0;C<t.length;C+=3)m(t[C+0],v),m(t[C+1],b),m(t[C+2],P),c(v,b,P,_)}function c(_,v,b,P){const C=P+1,A=[];for(let F=0;F<=C;F++){A[F]=[];const w=_.clone().lerp(b,F/C),S=v.clone().lerp(b,F/C),R=C-F;for(let N=0;N<=R;N++)N===0&&F===C?A[F][N]=w:A[F][N]=w.clone().lerp(S,N/R)}for(let F=0;F<C;F++)for(let w=0;w<2*(C-F)-1;w++){const S=Math.floor(w/2);w%2===0?(f(A[F][S+1]),f(A[F+1][S]),f(A[F][S])):(f(A[F][S+1]),f(A[F+1][S+1]),f(A[F+1][S]))}}function u(_){const v=new U;for(let b=0;b<o.length;b+=3)v.x=o[b+0],v.y=o[b+1],v.z=o[b+2],v.normalize().multiplyScalar(_),o[b+0]=v.x,o[b+1]=v.y,o[b+2]=v.z}function l(){const _=new U;for(let v=0;v<o.length;v+=3){_.x=o[v+0],_.y=o[v+1],_.z=o[v+2];const b=g(_)/2/Math.PI+.5,P=p(_)/Math.PI+.5;a.push(b,1-P)}x(),h()}function h(){for(let _=0;_<a.length;_+=6){const v=a[_+0],b=a[_+2],P=a[_+4],C=Math.max(v,b,P),A=Math.min(v,b,P);C>.9&&A<.1&&(v<.2&&(a[_+0]+=1),b<.2&&(a[_+2]+=1),P<.2&&(a[_+4]+=1))}}function f(_){o.push(_.x,_.y,_.z)}function m(_,v){const b=_*3;v.x=e[b+0],v.y=e[b+1],v.z=e[b+2]}function x(){const _=new U,v=new U,b=new U,P=new U,C=new Ke,A=new Ke,F=new Ke;for(let w=0,S=0;w<o.length;w+=9,S+=6){_.set(o[w+0],o[w+1],o[w+2]),v.set(o[w+3],o[w+4],o[w+5]),b.set(o[w+6],o[w+7],o[w+8]),C.set(a[S+0],a[S+1]),A.set(a[S+2],a[S+3]),F.set(a[S+4],a[S+5]),P.copy(_).add(v).add(b).divideScalar(3);const R=g(P);y(C,S+0,_,R),y(A,S+2,v,R),y(F,S+4,b,R)}}function y(_,v,b,P){P<0&&_.x===1&&(a[v]=_.x-1),b.x===0&&b.z===0&&(a[v]=P/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vr(e.vertices,e.indices,e.radius,e.details)}}class Hr extends Vr{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Hr(e.radius,e.detail)}}class Gr extends Xt{constructor(e=1,t=32,i=16,s=0,o=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:o,thetaStart:a,thetaLength:r},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+r,Math.PI);let u=0;const l=[],h=new U,f=new U,m=[],x=[],y=[],g=[];for(let p=0;p<=i;p++){const _=[],v=p/i;let b=0;p===0&&a===0?b=.5/t:p===i&&c===Math.PI&&(b=-.5/t);for(let P=0;P<=t;P++){const C=P/t;h.x=-e*Math.cos(s+C*o)*Math.sin(a+v*r),h.y=e*Math.cos(a+v*r),h.z=e*Math.sin(s+C*o)*Math.sin(a+v*r),x.push(h.x,h.y,h.z),f.copy(h).normalize(),y.push(f.x,f.y,f.z),g.push(C+b,1-v),_.push(u++)}l.push(_)}for(let p=0;p<i;p++)for(let _=0;_<t;_++){const v=l[p][_+1],b=l[p][_],P=l[p+1][_],C=l[p+1][_+1];(p!==0||a>0)&&m.push(v,b,C),(p!==i-1||c<Math.PI)&&m.push(b,P,C)}this.setIndex(m),this.setAttribute("position",new mt(x,3)),this.setAttribute("normal",new mt(y,3)),this.setAttribute("uv",new mt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class xa extends Xt{constructor(e=1,t=.4,i=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:o},i=Math.floor(i),s=Math.floor(s);const a=[],r=[],c=[],u=[],l=new U,h=new U,f=new U;for(let m=0;m<=i;m++)for(let x=0;x<=s;x++){const y=x/s*o,g=m/i*Math.PI*2;h.x=(e+t*Math.cos(g))*Math.cos(y),h.y=(e+t*Math.cos(g))*Math.sin(y),h.z=t*Math.sin(g),r.push(h.x,h.y,h.z),l.x=e*Math.cos(y),l.y=e*Math.sin(y),f.subVectors(h,l).normalize(),c.push(f.x,f.y,f.z),u.push(x/s),u.push(m/i)}for(let m=1;m<=i;m++)for(let x=1;x<=s;x++){const y=(s+1)*m+x-1,g=(s+1)*(m-1)+x-1,p=(s+1)*(m-1)+x,_=(s+1)*m+x;a.push(y,g,_),a.push(g,p,_)}this.setIndex(a),this.setAttribute("position",new mt(r,3)),this.setAttribute("normal",new mt(c,3)),this.setAttribute("uv",new mt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xa(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Yn extends Xi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sd,this.normalScale=new Ke(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const zc={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class Nx{constructor(e,t,i){const s=this;let o=!1,a=0,r=0,c;const u=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(l){r++,o===!1&&s.onStart!==void 0&&s.onStart(l,a,r),o=!0},this.itemEnd=function(l){a++,s.onProgress!==void 0&&s.onProgress(l,a,r),a===r&&(o=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return c?c(l):l},this.setURLModifier=function(l){return c=l,this},this.addHandler=function(l,h){return u.push(l,h),this},this.removeHandler=function(l){const h=u.indexOf(l);return h!==-1&&u.splice(h,2),this},this.getHandler=function(l){for(let h=0,f=u.length;h<f;h+=2){const m=u[h],x=u[h+1];if(m.global&&(m.lastIndex=0),m.test(l))return x}return null}}}const Ox=new Nx;class jr{constructor(e){this.manager=e!==void 0?e:Ox,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,o){i.load(e,s,t,o)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}jr.DEFAULT_MATERIAL_NAME="__DEFAULT";class Bx extends jr{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const o=this,a=zc.get(e);if(a!==void 0)return o.manager.itemStart(e),setTimeout(function(){t&&t(a),o.manager.itemEnd(e)},0),a;const r=fo("img");function c(){l(),zc.add(e,this),t&&t(this),o.manager.itemEnd(e)}function u(h){l(),s&&s(h),o.manager.itemError(e),o.manager.itemEnd(e)}function l(){r.removeEventListener("load",c,!1),r.removeEventListener("error",u,!1)}return r.addEventListener("load",c,!1),r.addEventListener("error",u,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(r.crossOrigin=this.crossOrigin),o.manager.itemStart(e),r.src=e,r}}class ya extends jr{constructor(e){super(e)}load(e,t,i,s){const o=new Ot,a=new Bx(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(r){o.image=r,o.needsUpdate=!0,t!==void 0&&t(o)},i,s),o}}class Wd extends Lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const hr=new gt,Vc=new U,Hc=new U;class kx{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ke(512,512),this.map=null,this.mapPass=null,this.matrix=new gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Or,this._frameExtents=new Ke(1,1),this._viewportCount=1,this._viewports=[new Nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Vc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Vc),Hc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Hc),t.updateMatrixWorld(),hr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hr),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(hr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class zx extends kx{constructor(){super(new wa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Vx extends Wd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.target=new Lt,this.shadow=new zx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Hx extends Wd{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Gx{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Gc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Gc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Gc(){return(typeof performance>"u"?Date:performance).now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ir}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ir);const jx="modulepreload",Wx=function(n,e){return new URL(n,e).href},jc={},Pe=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){const a=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(t.map(u=>{if(u=Wx(u,i),u in jc)return;jc[u]=!0;const l=u.endsWith(".css"),h=l?'[rel="stylesheet"]':"";if(!!i)for(let x=a.length-1;x>=0;x--){const y=a[x];if(y.href===u&&(!l||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${h}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":jx,l||(m.as="script"),m.crossOrigin="",m.href=u,c&&m.setAttribute("nonce",c),document.head.appendChild(m),l)return new Promise((x,y)=>{m.addEventListener("load",x),m.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${u}`)))})}))}function o(a){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=a,window.dispatchEvent(r),!r.defaultPrevented)throw a}return s.then(a=>{for(const r of a||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})};console.log("🎯 state.js loaded");const d={rotationX:.01,rotationY:.01,scale:1,morphWeights:{cube:1,sphere:0,pyramid:0,torus:0},morphBaseWeights:[0,1,0,0],morphAudioWeights:[0,0,0,0],morphBaseFrozen:!1,color:"#00ff00",hue:120,idleSpin:!0,texture:null,useTextureOnMorph:!1,useBackgroundImage:!1,backgroundScale:1,colorLayers:{geometry:{baseColor:"#00ff00",audioColor:"#ff0000",audioIntensity:.5},vessel:{baseColor:"#00ff00",audioColor:"#00ffff",audioIntensity:.3},particles:{baseColor:"#ffff00",audioColor:"#ff00ff",audioIntensity:.7},shadows:{baseColor:"#000000",audioColor:"#333333",audioIntensity:.2}},audio:{bass:0,mid:0,treble:0,enabled:!1,sensitivity:1,audioGain:1,autoTone:!0},ui:{projectorMode:!1},audioReactive:!1,vessel:{opacity:.5,scale:1,color:"#00ff00",enabled:!0,spinEnabled:!1,spinSpeed:.0035,scaleMultiplier:1.2,layout:"lattice",layoutIndex:0,audioSmoothing:.7,hueShiftRange:20,mode:"gyre",visible:!1},particles:{enabled:!0,count:5e3,minCount:1e3,maxCount:1e4,layout:"cube",hue:0,size:.02,minSize:.005,maxSize:.1,opacity:.5,organicMotion:!1,organicStrength:.2,audioReactiveHue:!1,velocity:.05,orbitalSpeed:.05,motionSmoothness:.5,trailEnabled:!1,trailLength:0,trailOpacity:.3,trailFade:1,trailAudioReactive:!1,trailLengthMin:2,trailLengthMax:10},motionTrailsEnabled:!1,motionTrailIntensity:.96,particlesEnabled:!0,particlesCount:5e3,particlesMotion:{velocity:.5,spread:1},particleDensity:2e3,particleSize:.1,particleMotionStrength:.5,useAudioJitter:!0,useEmojiParticles:!1,emojiStreams:[],emojiSequencer:{enabled:!1,bpm:120,currentBeat:0,patterns:{},timelineLength:16},emojiBanks:[null,null,null,null,null,null,null,null],currentBank:null,emojiPhysics:{mode:"none",gravityStrength:.01,orbitStrength:.005,repulsionStrength:.02,collisionEnabled:!0,audioModulation:!0,mouseInteraction:!1},emojiFusion:{enabled:!1,threshold:1},emojiConstellations:{type:"None",customPattern:null,scale:5,rotation:0,rotationSpeed:.01,audioSync:!0,beatSync:!1},mandala:{enabled:!1,ringCount:6,symmetry:6,audioReactive:!1,useCustomImage:!1,customImage:null,customImageName:null},emojiMandala:{enabled:!1,rings:3,symmetry:6,layout:["🍕","🌶️","🍄"],emoji:"🍕",ringRadii:[0,2,4,6,8,10],rotation:0,rotationSpeed:.02,audioModulation:!0,layeredAudio:!0,layoutMode:"radial",mandalaAudioReactive:!0,mandalaSensitivity:1,radiusPulse:0,anglePulse:0,musicalMode:!1,scale:"Major",rootNote:60,noteToEmoji:{},activeNotes:new Set,notePulse:{},performanceMode:!1,ringRotationSpeeds:[0,.01,.015,.02,.025,.03],differentialRotation:!0,scaleSequence:["Major","Dorian","Mixolydian","Phrygian"],scaleSequenceIndex:0,scaleSequenceEnabled:!1,scaleSequenceInterval:4e3,lastScaleChange:0,midiMappings:{symmetry:20,ringCount:21,rotationSpeed:22,scaleSequence:23}},lighting:{ambientIntensity:.4,directionalIntensity:1,directionalAngleX:-45,directionalAngleY:45},presets:[],morphState:{current:"cube",previous:"cube",progress:0,isTransitioning:!1,targets:["cube","sphere","pyramid","torus"]},shadows:{enabled:!0,ground:!0,backdrop:!0,opacity:.25,color:"#000000"},shadowBox:{threshold:.5,gain:1,bgColor:"#000000",fgColor:"#ffffff",palette:"Manual"},sprites:{enabled:!0,count:200},wireframe:{enabled:!0},geometry:{skyboxMode:!1,wireframe:!1,faceTextures:{front:null,back:null,left:null,right:null,top:null,bottom:null}},debug:{showWireframe:!1,showRibbon:!1},interpolation:{enabled:!0,active:!1,duration:2e3,startTime:null,startState:null,targetState:null}},W={presets:[],currentIndex:0,active:!1,duration:2e3,loop:!1,shuffle:!1,savedChains:[],currentChainName:null,stepStartTime:null,paused:!1,pausedAt:null,pausedProgress:0};let fr=!1;function Wr(){const n=d.morphWeights,e=Object.values(n).reduce((t,i)=>t+i,0);e>1?(Object.keys(n).forEach(t=>{n[t]=n[t]/e}),fr||(console.log("🎯 Morph weights auto-normalized (sum exceeded 1.0)"),fr=!0)):fr=!1}function $d(n,e){if(!d.audioReactive){d.morphBaseFrozen||(console.log("🛑 Audio OFF — morphBaseWeights frozen at",d.morphBaseWeights),d.morphBaseFrozen=!0);return}if(d.morphBaseFrozen=!1,d.morphState.targets.includes(n)){d.morphWeights[n]=Math.max(0,Math.min(1,e)),Wr();const t=["sphere","cube","pyramid","torus"].indexOf(n);t>=0&&(d.morphBaseWeights[t]=d.morphWeights[n],console.log("📦 morphBaseWeights updated (setMorphWeight)",d.morphBaseWeights))}else console.warn(`🎯 Invalid morph target: ${n}`)}function qd(n){if(!d.audioReactive){d.morphBaseFrozen||(console.log("🛑 Audio OFF — morphBaseWeights frozen at",d.morphBaseWeights),d.morphBaseFrozen=!0);return}d.morphBaseFrozen=!1,d.morphState.targets.forEach(e=>{n[e]!==void 0&&(d.morphWeights[e]=Math.max(0,Math.min(1,n[e])))}),Wr(),d.morphBaseWeights=[d.morphWeights.sphere||0,d.morphWeights.cube||0,d.morphWeights.pyramid||0,d.morphWeights.torus||0],console.log("📦 morphBaseWeights updated (setMorphWeights)",d.morphBaseWeights)}function $r(n){d.color=n;const e=parseInt(n.slice(1,3),16)/255,t=parseInt(n.slice(3,5),16)/255,i=parseInt(n.slice(5,7),16)/255,s=Math.max(e,t,i),o=Math.min(e,t,i),a=s-o;a===0?d.hue=0:s===e?d.hue=(t-i)/a*60:s===t?d.hue=((i-e)/a+2)*60:d.hue=((e-t)/a+4)*60,d.hue<0&&(d.hue+=360),d.hue=Math.round(d.hue)}function qr(n){d.hue=n%360;const e=d.hue/360,t=1,i=.5,s=(1-Math.abs(2*i-1))*t,o=s*(1-Math.abs(e*6%2-1)),a=i-s/2;let r,c,u;e<1/6?(r=s,c=o,u=0):e<2/6?(r=o,c=s,u=0):e<3/6?(r=0,c=s,u=o):e<4/6?(r=0,c=o,u=s):e<5/6?(r=o,c=0,u=s):(r=s,c=0,u=o),r=Math.round((r+a)*255),c=Math.round((c+a)*255),u=Math.round((u+a)*255),d.color=`#${r.toString(16).padStart(2,"0")}${c.toString(16).padStart(2,"0")}${u.toString(16).padStart(2,"0")}`}function po(n){const e=parseInt(n.slice(1,3),16),t=parseInt(n.slice(3,5),16),i=parseInt(n.slice(5,7),16);return{r:e,g:t,b:i}}function Xr(n){const e=Math.round(Math.max(0,Math.min(255,n.r))),t=Math.round(Math.max(0,Math.min(255,n.g))),i=Math.round(Math.max(0,Math.min(255,n.b)));return`#${e.toString(16).padStart(2,"0")}${t.toString(16).padStart(2,"0")}${i.toString(16).padStart(2,"0")}`}function Ca(n,e,t,i){const s=po(n),o=po(e),a=t*i,r={r:s.r+o.r*a,g:s.g+o.g*a,b:s.b+o.b*a};return Xr(r)}function Dn(n,e,t){return n+(e-n)*t}function Xd(n,e,t){const i=po(n),s=po(e),o={r:Dn(i.r,s.r,t),g:Dn(i.g,s.g,t),b:Dn(i.b,s.b,t)};return Xr(o)}function Yd(n,e,t){return n.map((i,s)=>Dn(i,e[s]||0,t))}function Kd(n){return n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2}var rd,ld,cd;const Xn={rotationX:.01,rotationY:.01,scale:1,morphBaseWeights:[0,1,0,0],colorLayers:JSON.parse(JSON.stringify(d.colorLayers)),vessel:{opacity:((rd=d.vessel)==null?void 0:rd.opacity)??.5},shadows:{opacity:((ld=d.shadows)==null?void 0:ld.opacity)??.25},particles:{opacity:((cd=d.particles)==null?void 0:cd.opacity)??.5}};function Jd(){d.interpolation.active=!1,W.active=!1,W.paused=!1,d.rotationX=Xn.rotationX,d.rotationY=Xn.rotationY,d.scale=Xn.scale,d.morphBaseWeights=[...Xn.morphBaseWeights],console.log("📦 morphBaseWeights updated (resetToBaseline)",d.morphBaseWeights),d.colorLayers=JSON.parse(JSON.stringify(Xn.colorLayers)),d.vessel.opacity=Xn.vessel.opacity,d.shadows.opacity=Xn.shadows.opacity,d.particles.opacity=Xn.particles.opacity,console.log("♻️ State reset to baseline")}let Yo=!0;function Ki(){const{audioReactive:n,audio:e}=d;return!n&&Yo!==!1?(console.log("🎵 Audio-reactive OFF — returning zero weights"),Yo=!1):n&&Yo!==!0&&(console.log("🎵 Audio-reactive ON — resuming audio response"),Yo=!0),n?!e||Number.isNaN(e.bass)||Number.isNaN(e.mid)||Number.isNaN(e.treble)?{bass:0,mid:0,treble:0,level:0}:{bass:e.bass??0,mid:e.mid??0,treble:e.treble??0,level:e.level??((e.bass??0)+(e.mid??0)+(e.treble??0))/3}:{bass:0,mid:0,treble:0,level:0}}window.addEventListener("mandala:imageSelected",n=>{const{url:e,name:t}=n.detail;d.mandala.useCustomImage=!0,d.mandala.customImage=e,d.mandala.customImageName=t,console.log(`🎯 State updated: mandala custom image → ${t} (exclusive mode ON)`)});window.addEventListener("mandala:imageCleared",()=>{d.mandala.useCustomImage=!1,d.mandala.customImage=null,d.mandala.customImageName=null,console.log("🎯 State updated: mandala custom image cleared (returning to emoji)")});d.audio=d.audio||{};d.audio.audioGain==null&&(d.audio.audioGain=1);console.log("🎯 State initialized:",d);const Wc=Object.freeze(Object.defineProperty({__proto__:null,BASELINE:Xn,blendColors:Ca,easeInOutCubic:Kd,getEffectiveAudio:Ki,hexToRGB:po,lerp:Dn,lerpArray:Yd,lerpColor:Xd,morphChain:W,normalizeMorphWeights:Wr,resetToBaseline:Jd,rgbToHex:Xr,setColor:$r,setHue:qr,setMorphWeight:$d,setMorphWeights:qd,state:d},Symbol.toStringTag,{value:"Module"}));console.log("🌀 hudMorph.js loaded");function Yr(n){const e=document.createElement("div");e.style.cssText="margin-bottom: 12px;";const t=document.createElement("label");return t.textContent=n,t.style.cssText="display: block; margin-bottom: 5px;",{container:e,label:t}}function $x(n,e,t){const{container:i,label:s}=Yr(n),o=document.createElement("input");return o.type="checkbox",o.checked=e,o.style.cssText="margin-left: 10px;",o.addEventListener("change",a=>t(a.target.checked)),i.appendChild(s),s.appendChild(o),i}function ui(n,e,t,i,s,o){const{container:a,label:r}=Yr(n),c=document.createElement("input");c.type="range",c.min=t,c.max=i,c.step=s,c.value=e,c.style.cssText="width: 100%; margin-top: 5px;";const u=document.createElement("span");return u.textContent=e,u.style.cssText="margin-left: 10px; color: #00ff00;",c.addEventListener("input",l=>{const h=parseFloat(l.target.value);u.textContent=h.toFixed(s>=1?0:s<.01?4:s<.001?3:2),o(h)}),a.appendChild(r),r.appendChild(u),a.appendChild(c),a}function qx(n,e,t,i){const{container:s,label:o}=Yr(n),a=document.createElement("select");return a.style.cssText="width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555;",t.forEach(r=>{const c=document.createElement("option");c.value=r,c.textContent=r.charAt(0).toUpperCase()+r.slice(1),r===e&&(c.selected=!0),a.appendChild(c)}),a.addEventListener("change",r=>i(r.target.value)),s.appendChild(o),s.appendChild(a),s}function Xx(n,e){console.log("🌀 Creating Morph HUD section");const t=$x("Idle Spin",!0,x=>{e({idleSpin:x})});n.appendChild(t);const i=ui("X Rotation",0,0,.2,.001,x=>{e({rotX:x})});n.appendChild(i);const s=ui("Y Rotation",0,0,.2,.001,x=>{e({rotY:x})});n.appendChild(s);const o=ui("Scale",1,.5,2,.1,x=>{e({scale:x})});n.appendChild(o);const a=qx("Morph Target","cube",["cube","sphere","pyramid","torus"],x=>{e({morphTarget:x})});n.appendChild(a);const r=ui("Morph Intensity",0,0,1,.01,x=>{e({morphBlend:x})});n.appendChild(r);const c=document.createElement("hr");c.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(c);const u=document.createElement("h4");u.textContent="🌀 Multi-Target Blends",u.style.cssText="margin: 0 0 10px 0; color: #ffff00; font-size: 12px;",n.appendChild(u);const l=ui("Cube Weight",1,0,1,.01,x=>{e({targetWeight:{target:"cube",weight:x}})});n.appendChild(l);const h=ui("Sphere Weight",0,0,1,.01,x=>{e({targetWeight:{target:"sphere",weight:x}})});n.appendChild(h);const f=ui("Pyramid Weight",0,0,1,.01,x=>{e({targetWeight:{target:"pyramid",weight:x}})});n.appendChild(f);const m=ui("Torus Weight",0,0,1,.01,x=>{e({targetWeight:{target:"torus",weight:x}})});n.appendChild(m),console.log("🌀 Morph HUD section created")}console.log("🖼️ mandalaUpload.js loaded");function Yx(n){if(window.__mandalaUploadMounted){console.warn("🖼️ Mandala upload already mounted, skipping");return}if(!window.__mandalaUploadInput){const o=document.createElement("input");o.type="file",o.accept="image/png,image/jpg,image/jpeg,image/webp",o.style.display="none",o.id="__mandalaUploadInput",o.addEventListener("change",a=>{const r=a.target.files[0];if(r&&r.type.startsWith("image/")){const c=new FileReader;c.onload=u=>{const l=u.target.result;window.dispatchEvent(new CustomEvent("mandala:imageSelected",{detail:{url:l,name:r.name}})),console.log(`🖼️ Mandala image selected: ${r.name}`)},c.readAsDataURL(r)}else console.warn("🖼️ Invalid file type")}),document.body.appendChild(o),window.__mandalaUploadInput=o}const e=document.createElement("div");e.style.cssText="display: flex; gap: 6px; margin-top: 8px; margin-bottom: 8px;",e.id="__mandalaUploadContainer";const t=document.createElement("button");t.textContent="📁 Upload PNG",t.style.cssText="flex: 1; padding: 6px 10px; background: rgba(0,255,255,0.15); border: 1px solid #00ffff; color: #00ffff; cursor: pointer; border-radius: 4px; font-size: 11px;",t.addEventListener("click",()=>{window.__mandalaUploadInput.click()});const i=document.createElement("button");i.textContent="🗑️ Clear",i.style.cssText="padding: 6px 10px; background: rgba(255,0,0,0.15); border: 1px solid #ff4444; color: #ff4444; cursor: pointer; border-radius: 4px; font-size: 11px;",i.addEventListener("click",()=>{window.__mandalaUploadInput.value="",window.dispatchEvent(new CustomEvent("mandala:imageCleared")),window.__mandalaUploadStatus&&(window.__mandalaUploadStatus.textContent="Using emoji texture",window.__mandalaUploadStatus.style.color="#888"),console.log("🖼️ Mandala custom image cleared")}),e.appendChild(t),e.appendChild(i);const s=document.createElement("div");s.textContent="Using emoji texture",s.style.cssText="font-size: 10px; color: #888; margin-bottom: 8px; font-style: italic;",s.id="__mandalaUploadStatus",window.__mandalaUploadStatus=s,window.addEventListener("mandala:imageSelected",o=>{const{name:a}=o.detail;s.textContent=`✓ ${a}`,s.style.color="#00ff00"}),n&&n.parentNode?(n.parentNode.insertBefore(e,n.nextSibling),e.parentNode.insertBefore(s,e.nextSibling),window.__mandalaUploadMounted=!0,console.log("🖼️ Mandala upload UI mounted")):console.error("🖼️ Cannot mount: target element not found")}console.log("🌀 hudMandala.js loaded");function Kx(n,e,t,i){const s=document.createElement("h4");s.textContent="🌀 Emoji Mandalas",s.style.cssText="margin: 15px 0 10px 0; color: #ff66ff; font-size: 12px;",n.appendChild(s);const o=t("Enable Mandala Mode",!1,O=>{d.mandala.enabled=O,d.emojiMandala.enabled=O,e({mandalaEnabled:O}),console.log(`🎛️ Mandala: ${O?"ON":"OFF"}`)});o.title="Radial symmetry mandala pattern",n.appendChild(o);const a=i("Rings",6,3,12,1,O=>{d.mandala.ringCount=O,d.emojiMandala.rings=O,e({mandalaRings:O}),console.log(`🎛️ Mandala rings: ${O}`)});a.title="Number of concentric rings (3-12)",n.appendChild(a);const r=document.createElement("label");r.textContent="Layout Mode",r.style.cssText="display: block; font-size: 11px; margin-bottom: 4px; color: #ff66ff;",n.appendChild(r);const c=document.createElement("select");c.style.cssText="width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ff66ff; color: #ff66ff; border-radius: 4px; margin-bottom: 10px; font-size: 11px;",[{value:"radial",label:"⭕ Radial (Concentric)"},{value:"spiral",label:"🌀 Spiral (Fibonacci)"},{value:"grid",label:"🔲 Grid (Lattice)"}].forEach(O=>{const fe=document.createElement("option");fe.value=O.value,fe.textContent=O.label,O.value==="radial"&&(fe.selected=!0),c.appendChild(fe)}),c.addEventListener("change",()=>{const O=c.value;e({mandala:{layoutMode:O}});const fe=O==="spiral"?"🌀":O==="grid"?"🔲":"⭕";console.log(`📟 HUD → Mandala layout set to ${O.charAt(0).toUpperCase()+O.slice(1)} ${fe}`)}),c.title="Mandala geometry layout pattern",n.appendChild(c);const l=i("Symmetry",6,2,12,1,O=>{d.mandala.symmetry=O,d.emojiMandala.symmetry=O,e({mandalaSymmetry:O}),console.log(`🎛️ Mandala symmetry: ${O}`)});l.title="Symmetry fold count (2-12 spokes)",n.appendChild(l);const h=i("Rotation Speed",.02,0,.1,.005,O=>{e({mandala:{rotationSpeed:O}})});h.title="Base rotation speed",n.appendChild(h);const f=t("Audio Speed Boost",!0,O=>{e({mandala:{audioModulation:O}})});f.title="Audio increases rotation speed",n.appendChild(f);const m=t("Layered Audio (Bass/Mid/Treble)",!0,O=>{e({mandala:{layeredAudio:O}})});m.title="Inner rings→bass, middle→mids, outer→treble",n.appendChild(m);const x=t("Audio-Reactive Mandala",!0,O=>{e({mandala:{mandalaAudioReactive:O}}),console.log(`📟 HUD → Mandala audioReactive = ${O?"ON":"OFF"}`)});x.title="Mandala pulses and expands with audio",n.appendChild(x);const y=i("Mandala Sensitivity",1,0,2,.1,O=>{e({mandala:{mandalaSensitivity:O}}),console.log(`📟 HUD → Mandala sensitivity = ${O.toFixed(1)}`)});y.title="Audio reactivity strength (0-200%)",n.appendChild(y);const g=document.createElement("label");g.textContent="Mandala Layout Preset",g.style.cssText="display: block; font-size: 11px; margin-top: 10px; margin-bottom: 4px; color: #ff66ff;",n.appendChild(g);const p=document.createElement("select");p.style.cssText="width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ff66ff; color: #ff66ff; border-radius: 4px; margin-bottom: 10px; font-size: 11px;",[{value:"Classic",label:"🎨 Classic (evenly spaced, symmetry=6)"},{value:"Flower",label:"🌸 Flower (alternating radii, symmetry=8)"},{value:"Spiral",label:"🌀 Spiral (golden angle rotation)"},{value:"Dense",label:"🔷 Dense (doubled rings, symmetry=12)"}].forEach(O=>{const fe=document.createElement("option");fe.value=O.value,fe.textContent=O.label,O.value==="Classic"&&(fe.selected=!0),p.appendChild(fe)}),p.addEventListener("change",()=>{const O=p.value;e({mandala:{layoutPreset:O}}),console.log(`📟 HUD → Mandala layout preset: ${O}`)}),p.title="Apply predefined mandala layout configuration",n.appendChild(p);const v=i("Ring Spacing",1,.2,2,.1,O=>{e({mandala:{ringSpacing:O}}),console.log(`📟 HUD → Ring spacing = ${O.toFixed(1)}`)});v.title="Distance multiplier between rings (0.2-2.0)",n.appendChild(v);const b=i("Base Radius",1,.5,3,.1,O=>{e({mandala:{baseRadius:O}}),console.log(`📟 HUD → Base radius = ${O.toFixed(1)}`)});b.title="Base radius multiplier (0.5-3.0)",n.appendChild(b);const P=i("Global Scale",1,.5,2,.1,O=>{e({mandala:{globalScale:O}}),console.log(`📟 HUD → Global scale = ${O.toFixed(1)}`)});P.title="Overall mandala scale (0.5-2.0)",n.appendChild(P);const C=t("Rainbow Mode",!1,O=>{e({mandala:{rainbowMode:O}}),console.log(`📟 HUD → Rainbow mode: ${O?"ON":"OFF"}`)});C.title="Apply rainbow hue shift per ring",n.appendChild(C);const A=document.createElement("label");A.textContent="Mandala Emoji",A.style.cssText="display: block; font-size: 11px; margin-top: 10px; margin-bottom: 6px; color: #ff66ff;",n.appendChild(A);const F=document.createElement("div");F.style.cssText="display: flex; gap: 8px; margin-bottom: 10px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px;",["🍕","🌶️","🍄","⭐"].forEach((O,fe)=>{const Me=document.createElement("label");Me.style.cssText="display: flex; align-items: center; gap: 4px; cursor: pointer; padding: 4px 8px; border-radius: 4px; background: rgba(255,255,255,0.1); transition: background 0.2s;";const Ie=document.createElement("input");Ie.type="radio",Ie.name="mandalaEmoji",Ie.value=O,Ie.checked=fe===0,Ie.style.cssText="cursor: pointer;";const L=document.createElement("span");L.textContent=O,L.style.cssText="font-size: 20px;",Ie.addEventListener("change",()=>{Ie.checked&&(e({mandala:{emoji:O}}),console.log(`📟 HUD → Mandala emoji set to ${O}`))}),Me.appendChild(Ie),Me.appendChild(L),F.appendChild(Me)}),n.appendChild(F),Yx(F);const S=document.createElement("label");S.textContent="Ring Emoji Layout (center → outer)",S.style.cssText="display: block; font-size: 11px; margin-top: 10px; margin-bottom: 4px; color: #ff66ff;",n.appendChild(S);const R=document.createElement("input");R.type="text",R.value=d.emojiMandala.layout.join(" "),R.placeholder="🍕 🌶️ 🍄",R.style.cssText="width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ff66ff; color: #ff66ff; border-radius: 4px; margin-bottom: 10px; font-size: 14px;",R.addEventListener("input",O=>{const fe=O.target.value.split(/\s+/).filter(Me=>Me.length>0);d.emojiMandala.layout=fe,console.log(`🌀 Mandala layout updated: ${fe.join(" → ")}`)}),R.title="Space-separated emojis for each ring",n.appendChild(R);const N=document.createElement("h4");N.textContent="🎼 Musical Scale Mode",N.style.cssText="margin: 15px 0 10px 0; color: #ffdd66; font-size: 12px;",n.appendChild(N);const k=t("Enable Musical Mode",!1,O=>{e({mandala:{musicalMode:O}})});k.title="Emojis arranged by musical scale intervals",n.appendChild(k);const G=document.createElement("label");G.textContent="Scale/Mode",G.style.cssText="display: block; font-size: 11px; margin-bottom: 4px; color: #ffdd66;",n.appendChild(G);const X=document.createElement("select");X.style.cssText="width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ffdd66; color: #ffdd66; border-radius: 4px; margin-bottom: 10px; font-size: 11px;",["Major","Minor","Pentatonic","Dorian","Phrygian","Lydian","Mixolydian","Chromatic"].forEach(O=>{const fe=document.createElement("option");fe.value=O,fe.textContent=O,O==="Major"&&(fe.selected=!0),X.appendChild(fe)}),X.addEventListener("change",()=>{const O=X.value;e({mandala:{scale:O,mode:O}})}),n.appendChild(X);const J=i("Root Note (MIDI)",60,48,72,1,O=>{d.emojiMandala.rootNote=O;const Me=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][O%12],Ie=Math.floor(O/12)-1;console.log(`🎼 Root note: ${Me}${Ie} (MIDI ${O})`)});J.title="MIDI root note for scale (C4=60)",n.appendChild(J);const V=document.createElement("h4");V.textContent="🎛️ Performance Controls",V.style.cssText="margin: 15px 0 10px 0; color: #ff9944; font-size: 12px;",n.appendChild(V);const ae=t("Enable Performance Mode",!1,O=>{e({mandala:{performanceMode:O}})});ae.title="Live manipulation controls enabled",n.appendChild(ae);const ce=t("Differential Ring Rotation",!0,O=>{d.emojiMandala.differentialRotation=O,console.log(`🎛️ Differential rotation: ${O?"ON (each ring independent)":"OFF (unified)"}`)});ce.title="Each ring rotates at different speed",n.appendChild(ce);const ue=i("Ring Count (Performance)",3,1,8,1,O=>{d.emojiMandala.rings=O,console.log(`🎛️ Mandala rings: ${O}`)});ue.title="Number of rings (1-8 in performance mode)",n.appendChild(ue);const Fe=i("Symmetry (Performance)",6,2,12,1,O=>{d.emojiMandala.symmetry=O,console.log(`🎛️ Mandala symmetry: ${O}-fold`)});Fe.title="Radial symmetry spokes (2-12)",n.appendChild(Fe);const He=t("Auto Scale Sequence",!1,O=>{d.emojiMandala.scaleSequenceEnabled=O,O?(d.emojiMandala.lastScaleChange=performance.now(),console.log(`🎛️ Scale sequencing ON: ${d.emojiMandala.scaleSequence.join(" → ")}`)):console.log("🎛️ Scale sequencing OFF")});He.title="Auto-advance through scale progression",n.appendChild(He);const q=i("Scale Change Interval (s)",4,1,10,.5,O=>{d.emojiMandala.scaleSequenceInterval=O*1e3,console.log(`🎛️ Scale interval: ${O}s`)});q.title="Seconds between scale changes",n.appendChild(q);const te=document.createElement("label");te.textContent="Scale Sequence",te.style.cssText="display: block; font-size: 11px; margin-top: 10px; margin-bottom: 4px; color: #ff9944;",n.appendChild(te);const re=document.createElement("input");re.type="text",re.value=d.emojiMandala.scaleSequence.join(" "),re.placeholder="Major Dorian Mixolydian",re.style.cssText="width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ff9944; color: #ff9944; border-radius: 4px; margin-bottom: 10px; font-size: 11px;",re.addEventListener("input",O=>{const fe=O.target.value.split(/\s+/).filter(Me=>Me.length>0);d.emojiMandala.scaleSequence=fe,console.log(`🎛️ Scale sequence updated: ${fe.join(" → ")}`)}),re.title="Space-separated scale names",n.appendChild(re),console.log("🌀 Mandala HUD section created")}function $c(){console.log("🌀 HUD(Mandala): refresh")}console.log("✨ hudParticles.js loaded");function Jx(n,e,t,i){const s=document.createElement("hr");s.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(s);const o=document.createElement("h4");o.textContent="✨ Particles",o.style.cssText="margin: 0 0 10px 0; color: #00ffff; font-size: 12px;",n.appendChild(o);const a=document.createElement("div");a.style.cssText="margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;";const r=document.createElement("div");r.innerHTML='<span style="color: #888;">FPS:</span> <span id="hud-fps" style="color: #0f0;">--</span>',r.style.cssText="margin-bottom: 5px; font-size: 12px;",a.appendChild(r);const c=document.createElement("div");c.innerHTML='<span style="color: #888;">Draw Calls:</span> <span id="hud-drawcalls" style="color: #0ff;">--</span>',c.style.cssText="font-size: 12px;",a.appendChild(c),n.appendChild(a);const u=t("Enable Particles",!0,N=>{e({particlesEnabled:N})});n.appendChild(u);const l=i("Particle Density",5e3,1e3,1e4,100,N=>{e({particlesCount:N})});l.title="Number of particles (1000-10000, requires reinit)",n.appendChild(l);const h=document.createElement("div");h.style.cssText="margin-bottom: 10px;";const f=document.createElement("label");f.textContent="Layout",f.style.cssText="display: block; margin-bottom: 5px; color: #ccc; font-size: 12px;",h.appendChild(f);const m=document.createElement("select");m.id="particle-layout-dropdown",m.style.cssText="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #555; border-radius: 3px;",["cube","sphere","torus","vesselPlanes"].forEach(N=>{const k=document.createElement("option");k.value=N,N==="vesselPlanes"?k.textContent="Vessel Planes":k.textContent=N.charAt(0).toUpperCase()+N.slice(1),k.selected=N==="cube",m.appendChild(k)}),m.addEventListener("change",()=>{e({particlesLayout:m.value})}),h.appendChild(m),n.appendChild(h);const x=document.createElement("h4");x.textContent="✨ Particle Polish",x.style.cssText="margin: 15px 0 10px 0; color: #ffff00; font-size: 12px;",n.appendChild(x);const y=i("Hue Shift",0,0,360,5,N=>{e({particlesHue:N})});n.appendChild(y);const g=i("Size",.5,.05,2,.05,N=>{e({particlesSize:N})});g.title="True 3D world-unit size (0.05 = tiny, 2.0 = large)",n.appendChild(g);const p=i("Opacity",.5,0,1,.05,N=>{e({particlesOpacity:N})});n.appendChild(p);const _=t("Organic Motion",!1,N=>{e({particlesOrganicMotion:N})});n.appendChild(_);const v=i("Organic Strength",.2,0,1,.05,N=>{e({particlesOrganicStrength:N})});v.title="Controls wander strength (0 = clean orbit, 1 = chaotic swarm)",n.appendChild(v);const b=t("Audio-Reactive Hue",!1,N=>{e({particlesAudioReactiveHue:N})});n.appendChild(b);const P=i("Audio Gain",2,.5,5,.1,N=>{e({particlesAudioGain:N})});P.title="Amplifies per-particle audio hue variation",n.appendChild(P);const C=i("Orbital Speed",.05,.01,2,.01,N=>{e({particlesVelocity:N})});C.title="Controls particle orbital speed around vessel (min: 0.01)",n.appendChild(C);const A=i("Motion Smoothness",.5,0,1,.1,N=>{e({particlesMotionSmoothness:N})});n.appendChild(A);const F=i("Density (Debug)",2e3,500,4e3,100,N=>{d.particleDensity=N,console.log(`🎛️ Particle density: ${N}`)});F.title="Particle density (500-4000)",n.appendChild(F);const w=i("Size (Debug)",.1,.05,1,.05,N=>{d.particleSize=N,console.log(`🎛️ Particle size: ${N}`)});w.title="Particle size (0.05-1.0)",n.appendChild(w);const S=i("Motion Strength",.5,0,1,.1,N=>{d.particleMotionStrength=N,console.log(`🎛️ Particle motion strength: ${N}`)});S.title="Global drift strength multiplier",n.appendChild(S);const R=t("Audio Jitter",!0,N=>{d.useAudioJitter=N,console.log(`🎛️ Audio jitter: ${N?"ON":"OFF"}`)});R.title="Add velocity bursts on FFT peaks",n.appendChild(R),function(){const k=window.SpritesReactConfig;if(!k)return;const G=document.createElement("div");G.style.cssText="margin-top:12px;padding-top:8px;border-top:1px solid #333;",G.innerHTML=`
      <div style="font-weight:600;margin-bottom:6px;">🧩 Sprites Reactivity</div>

      <label style="display:block;margin-bottom:4px;">Attack
        <input id="sp-attack" type="range" min="0.05" max="0.8" step="0.01">
      </label>

      <label style="display:block;margin:8px 0 4px;">Release
        <input id="sp-release" type="range" min="0.05" max="0.6" step="0.01">
      </label>

      <label style="display:block;margin:8px 0 4px;">Beat Threshold
        <input id="sp-thresh" type="range" min="0.2" max="0.9" step="0.01">
      </label>

      <label style="display:block;margin:8px 0 4px;">Size Amp
        <input id="sp-size" type="range" min="0.1" max="2.0" step="0.05">
      </label>

      <label style="display:block;margin:8px 0 4px;">Spawn Amp
        <input id="sp-spawn" type="range" min="0.1" max="3.0" step="0.05">
      </label>

      <label style="display:block;margin:8px 0 4px;">Hue Amp
        <input id="sp-hue" type="range" min="0" max="240" step="5">
      </label>

      <label style="display:block;margin:8px 0 4px;">Beat Flash
        <input id="sp-flash" type="range" min="0" max="0.8" step="0.05">
      </label>
    `,n.appendChild(G);const X=J=>G.querySelector(J);X("#sp-attack").value=k.attack??.35,X("#sp-release").value=k.release??.12,X("#sp-thresh").value=k.beatThresh??.48,X("#sp-size").value=k.sizeMulAmp??1.1,X("#sp-spawn").value=k.spawnAmp??1.7,X("#sp-hue").value=k.hueAmp??140,X("#sp-flash").value=k.beatFlash??.35;const Y=()=>{k.attack=parseFloat(X("#sp-attack").value),k.release=parseFloat(X("#sp-release").value),k.beatThresh=parseFloat(X("#sp-thresh").value),k.sizeMulAmp=parseFloat(X("#sp-size").value),k.spawnAmp=parseFloat(X("#sp-spawn").value),k.hueAmp=parseFloat(X("#sp-hue").value),k.beatFlash=parseFloat(X("#sp-flash").value),console.log("🧩 SpritesReactConfig updated:",{...k})};["#sp-attack","#sp-release","#sp-thresh","#sp-size","#sp-spawn","#sp-hue","#sp-flash"].forEach(J=>X(J).addEventListener("input",Y))}(),console.log("✨ Particles HUD section created")}function qc(){console.log("✨ HUD(Particles): refresh")}console.log("🖼️ visual.js loaded");let dn=null;function Zx(n){const e=window.innerWidth/window.innerHeight,t=new bi(2*e,2),i=new Yi({color:1118481});dn=new Pt(t,i),dn.position.z=-10,n.add(dn),console.log("🖼️ Background plane initialized")}function Qx(){if(!dn)return;d.useBackgroundImage&&d.texture?(dn.material.map=d.texture,dn.material.color.set(16777215)):(dn.material.map=null,dn.material.color.set(1118481)),dn.material.needsUpdate=!0;const n=d.backgroundScale||1;dn.scale.set(n,n,1)}function ey(n){dn&&(d.backgroundScale=n,dn.scale.set(n,n,1))}console.log("🖼️ hudBackground.js loaded");function ty(n){const e=document.createElement("input");e.type="file",e.accept="image/*",e.style.display="none";const t=document.createElement("button");t.innerText="Upload Image",t.style.cssText="margin: 10px 0; padding: 8px 12px; background: #444; color: white; border: 1px solid #666; border-radius: 4px; cursor: pointer;",t.onclick=()=>e.click(),e.addEventListener("change",h=>{const f=h.target.files[0];if(!f)return;const m=URL.createObjectURL(f);new ya().load(m,y=>{d.texture=y,console.log("🖼️ Image loaded →",f.name)},void 0,y=>console.error("❌ Texture load failed:",y))});const i=document.createElement("input");i.type="checkbox",i.checked=d.useTextureOnMorph,i.onchange=h=>{d.useTextureOnMorph=h.target.checked,console.log("🎛️ Morph texture:",d.useTextureOnMorph?"ON":"OFF")};const s=document.createElement("label");s.innerText="Apply texture to morph shape",s.style.cssText="display: block; margin: 10px 0; cursor: pointer;",s.prepend(i);const o=document.createElement("input");o.type="checkbox",o.id="useBackgroundImage",o.checked=d.useBackgroundImage,o.onchange=()=>{d.useBackgroundImage=o.checked,console.log(`🎛️ Background image: ${d.useBackgroundImage?"ON":"OFF"}`)};const a=document.createElement("label");a.htmlFor="useBackgroundImage",a.innerText="Show as background",a.style.cssText="display: block; margin: 10px 0; cursor: pointer;",a.prepend(o);const r=document.createElement("div");r.style.cssText="margin: 10px 0;";const c=document.createElement("label");c.textContent="Background Scale:",c.style.cssText="display: block; margin-bottom: 4px; font-size: 12px;";const u=document.createElement("input");u.type="range",u.min="0.5",u.max="2.0",u.step="0.01",u.value=d.backgroundScale||"1.0",u.style.cssText="width: 100%;";const l=document.createElement("span");l.textContent=(d.backgroundScale||1).toFixed(2),l.style.cssText="margin-left: 8px; font-size: 11px; color: #aaa;",u.addEventListener("input",h=>{const f=parseFloat(h.target.value);l.textContent=f.toFixed(2),ey(f),console.log(`🖼️ Background scale: ${f.toFixed(2)}`)}),r.appendChild(c),r.appendChild(u),r.appendChild(l),n.appendChild(t),n.appendChild(e),n.appendChild(s),n.appendChild(a),n.appendChild(r),console.log("🖼️ Background HUD section created")}console.log("🌑 hudShadows.js loaded");function ny(n,e,t,i,s){const o=document.createElement("hr");o.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(o);const a=document.createElement("h4");a.textContent="🌑 Shadows",a.style.cssText="margin: 0 0 10px 0; color: #555; font-size: 12px;",n.appendChild(a);const r=t("Enable Shadows",!0,f=>{e({shadowsEnabled:f})});n.appendChild(r);const c=t("Ground Shadow",!0,f=>{e({shadowsGround:f})});n.appendChild(c);const u=t("Backdrop Shadow",!0,f=>{e({shadowsBackdrop:f})});n.appendChild(u);const l=i("Shadow Opacity",.25,0,1,.05,f=>{e({shadowsOpacity:f})});n.appendChild(l);const h=s("Shadow Color","#000000",f=>{e({shadowsColor:f})});n.appendChild(h),console.log("🌑 Shadows HUD section created")}console.log("🚢 hudVessel.js loaded");function Ta(n){const e=document.createElement("div");e.style.cssText="margin-bottom: 12px;";const t=document.createElement("label");return t.textContent=n,t.style.cssText="display: block; margin-bottom: 5px;",{container:e,label:t}}function pr(n,e,t){const{container:i,label:s}=Ta(n),o=document.createElement("input");return o.type="checkbox",o.checked=e,o.style.cssText="margin-left: 10px;",o.addEventListener("change",a=>t(a.target.checked)),i.appendChild(s),s.appendChild(o),i}function no(n,e,t,i,s,o){const{container:a,label:r}=Ta(n),c=document.createElement("input");c.type="range",c.min=t,c.max=i,c.step=s,c.value=e,c.style.cssText="width: 100%; margin-top: 5px;";const u=document.createElement("span");return u.textContent=e,u.style.cssText="margin-left: 10px; color: #00ff00;",c.addEventListener("input",l=>{const h=parseFloat(l.target.value);u.textContent=h.toFixed(s>=1?0:s<.01?4:2),o(h)}),a.appendChild(r),r.appendChild(u),a.appendChild(c),a}function iy(n,e,t){const{container:i,label:s}=Ta(n),o=document.createElement("input");return o.type="color",o.value=e,o.style.cssText="margin-left: 10px; cursor: pointer;",o.addEventListener("input",a=>t(a.target.value)),i.appendChild(s),s.appendChild(o),i}function Xc(n,e,t,i){const{container:s,label:o}=Ta(n),a=document.createElement("select");return a.style.cssText="width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555;",n==="Vessel Layout"&&(a.id="vessel-layout-dropdown"),t.forEach(r=>{const c=document.createElement("option");c.value=r,c.textContent=r,r===e&&(c.selected=!0),a.appendChild(c)}),a.addEventListener("change",r=>i(r.target.value)),s.appendChild(o),s.appendChild(a),s}function sy(n,e){console.log("🚢 Creating Vessel HUD section");const t=document.createElement("hr");t.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(t);const i=document.createElement("h4");i.textContent="🚢 Vessel",i.style.cssText="margin: 0 0 10px 0; color: #00ff00; font-size: 12px;",n.appendChild(i);const s=pr("Enable Vessel",!0,g=>{e({vesselEnabled:g})});n.appendChild(s);const o=Xc("Vessel Mode","gyre",["gyre","conflat6"],g=>{e({vesselMode:g})});o.title="Switch between Gyre (torus rings) and Conflat 6 (cube-sphere circles)",n.appendChild(o);const a=no("Vessel Opacity",.5,0,1,.01,g=>{e({vesselOpacity:g})});n.appendChild(a);const r=no("Vessel Scale",1,.5,2,.1,g=>{e({vesselScale:g})});n.appendChild(r);const c=iy("Vessel Color","#00ff00",g=>{e({vesselColor:g})});n.appendChild(c);const u=pr("Vessel Spin",!1,g=>{e({vesselSpinEnabled:g})});n.appendChild(u);const l=no("Spin Speed",.0035,0,.02,5e-4,g=>{e({vesselSpinSpeed:g})});n.appendChild(l);const h=Xc("Vessel Layout","lattice",["lattice","hoops","shells"],g=>{e({vesselLayout:g})});n.appendChild(h);const f=no("Audio Smoothing",.7,.1,.9,.05,g=>{e({vesselAudioSmoothing:g})});n.appendChild(f);const m=no("Hue Shift Range",20,0,60,5,g=>{e({vesselHueShiftRange:g})});n.appendChild(m);const x=pr("Show Compass Rings",!1,g=>{e({vesselVisible:g})});x.title="Show/hide 6 color-coded compass rings (N/S/E/W/Up/Down)",n.appendChild(x);const y=document.createElement("div");y.style.cssText="margin-top: 15px; font-size: 12px; color: #888;",y.innerHTML='<p id="vessel-debug">Radius: --</p>',n.appendChild(y),console.log("🚢 Vessel HUD section created")}console.log("🎶 hudAudio.js loaded");function Zd(n){const e=document.createElement("div");e.style.cssText="margin-bottom: 12px;";const t=document.createElement("label");return t.textContent=n,t.style.cssText="display: block; margin-bottom: 5px;",{container:e,label:t}}function oy(n,e,t){const{container:i,label:s}=Zd(n),o=document.createElement("input");return o.type="checkbox",o.checked=e,o.style.cssText="margin-left: 10px;",o.addEventListener("change",a=>t(a.target.checked)),i.appendChild(s),s.appendChild(o),i}function Yc(n,e,t,i,s,o){const{container:a,label:r}=Zd(n),c=document.createElement("input");c.type="range",c.min=t,c.max=i,c.step=s,c.value=e,c.style.cssText="width: 100%; margin-top: 5px;";const u=document.createElement("span");return u.textContent=e,u.style.cssText="margin-left: 10px; color: #00ff00;",c.addEventListener("input",l=>{const h=parseFloat(l.target.value);u.textContent=h.toFixed(s>=1?0:s<.01?4:s<.1?2:1),o(h)}),a.appendChild(r),r.appendChild(u),a.appendChild(c),a}function ay(n,e){console.log("🎶 Creating Audio HUD section");const t=document.createElement("hr");t.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(t);const i=document.createElement("h4");i.textContent="🎶 Audio-Reactive",i.style.cssText="margin: 0 0 10px 0; color: #ff9900; font-size: 12px;",n.appendChild(i);const s=oy("Audio-Reactive Morphing",!1,p=>{console.log("🪗 HUD audio toggle clicked"),e({audioEnabled:p})});n.appendChild(s);const o=Yc("Audio Sensitivity",1,.5,2,.1,p=>{e({audioSensitivity:p})});n.appendChild(o);const a=Yc("Master Reactivity (×)",1,.2,4,.05,p=>{e({audioGain:p})});n.appendChild(a);const r=document.createElement("div");r.style.cssText="margin-top:10px;";const c=document.createElement("label");c.textContent="Input Device:",c.style.cssText="display:block;margin-bottom:4px;";const u=document.createElement("select");u.style.cssText="width:100%;",r.appendChild(c),r.appendChild(u),n.appendChild(r);async function l(){var p,_;try{const v=await((_=(p=window.AudioEngine)==null?void 0:p.listInputs)==null?void 0:_.call(p));u.innerHTML="",(v||[]).forEach(b=>{const P=document.createElement("option");P.value=b.deviceId,P.textContent=b.label||"(Unnamed input)",u.appendChild(P)})}catch(v){console.warn("Audio device enumeration failed:",v)}}u.addEventListener("change",async()=>{var p,_;await((_=(p=window.AudioEngine)==null?void 0:p.selectDevice)==null?void 0:_.call(p,u.value))});const h=document.createElement("div");h.style.cssText="margin-top:8px;";const f=document.createElement("label");f.textContent="Mic Boost (Pre-Gain)",f.style.cssText="display:block;margin-bottom:4px;";const m=document.createElement("input");m.id="audio-pregain",m.type="range",m.min="0.1",m.max="16",m.step="0.1",m.value="4",m.style.cssText="width:100%;",m.addEventListener("input",p=>{var _,v;return(v=(_=window.AudioEngine)==null?void 0:_.setPreGain)==null?void 0:v.call(_,parseFloat(p.target.value))}),h.appendChild(f),h.appendChild(m),n.appendChild(h);const x=document.createElement("div");x.style.cssText="margin-top:10px;";const y=document.createElement("button");y.textContent="🔊 Test Tone",y.style.cssText="width:100%;padding:6px;border-radius:6px;",y.addEventListener("click",async()=>{var p,_;await((_=(p=window.AudioEngine)==null?void 0:p.toggleTestTone)==null?void 0:_.call(p))}),x.appendChild(y),n.appendChild(x);const g=document.createElement("button");g.textContent="↻ Force-apply audio bands to visuals",g.style.cssText="margin-top:8px;width:100%;padding:6px;border-radius:6px;",g.addEventListener("click",()=>{var _,v;const p=(_=window.AudioEngine)==null?void 0:_.bands;if(p){try{(v=window.notifyHUDUpdate)==null||v.call(window,{audioBands:{...p}})}catch{}console.log("🪢 Applied bands to visuals:",p)}}),n.appendChild(g),setTimeout(l,0),console.log("🎶 Audio HUD section created")}function Kc(){console.log("🎶 HUD(Audio): refresh")}let Ts=null,Qd=[],eu=[],tu=[],Ko=!1;function ry(n){if(Ko){n();return}if(!navigator.requestMIDIAccess){console.warn("🎹 Web MIDI API not supported - MIDI functionality disabled"),Ko=!0,n();return}navigator.requestMIDIAccess().then(e=>{Ts=e,uy(),Ko=!0,console.log("🎹 MIDI system initialized"),n()}).catch(e=>{console.warn("🎹 MIDI access denied or failed:",e.message),Ko=!0,n()})}function ly(n){Qd.push(n)}function cy(n){eu.push(n)}function dy(n){tu.push(n)}function nu(){return Ts?Array.from(Ts.inputs.values()).length:0}function uy(){if(!Ts)return;const n=Array.from(Ts.inputs.values());if(n.length===0){console.log("🎹 No MIDI input devices found");return}console.log(`🎹 Found ${n.length} MIDI input device(s):`),n.forEach(e=>{console.log(`  - ${e.name}`),e.onmidimessage=iu}),Ts.onstatechange=hy}function iu(n){const[e,t,i]=n.data,s=n.target.name||"Unknown Device",o=e&240;if(o===176)Qd.forEach(a=>{try{a({cc:t,value:i,device:s})}catch(r){console.error("🎹 Error in CC callback:",r)}});else if(o===144||o===128){const a=o===144&&i>0,r=t,c=i;eu.forEach(u=>{try{u({note:r,velocity:c,noteOn:a,device:s})}catch(l){console.error("🎹 Error in note callback:",l)}})}else if(o===224){const a=i<<7|t,r=(a-8192)/8192;tu.forEach(c=>{try{c({value:r,rawValue:a,device:s})}catch(u){console.error("🎹 Error in pitch bend callback:",u)}})}}function hy(n){const e=n.port;e.type==="input"&&(e.state==="connected"?(console.log(`🎹 MIDI device connected: ${e.name}`),e.onmidimessage=iu):e.state==="disconnected"&&console.log(`🎹 MIDI device disconnected: ${e.name}`))}console.log("🎹 hudMidi.js loaded");window.MidiLearn=window.MidiLearn||{active:!1,target:null,setTarget(n){this.target=n,console.log("🎓 MIDI Learn target:",n)},setActive(n){this.active=!!n,console.log(`🎓 MIDI Learn: ${this.active?"ON":"OFF"}`)}};function fy(n){const e=document.createElement("div");e.style.cssText="margin-bottom: 12px;";const t=document.createElement("label");return t.textContent=n,t.style.cssText="display: block; margin-bottom: 5px;",{container:e,label:t}}function py(n,e,t){const{container:i,label:s}=fy(n),o=document.createElement("input");return o.type="checkbox",o.checked=e,o.style.cssText="margin-left: 10px;",o.addEventListener("change",a=>t(a.target.checked)),i.appendChild(s),s.appendChild(o),i}function my(n,e){console.log("🎹 Creating MIDI HUD section");const t=document.createElement("hr");t.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(t);const i=document.createElement("h4");i.textContent="🎹 MIDI",i.style.cssText="margin: 0 0 10px 0; color: #ff00ff; font-size: 12px;",n.appendChild(i);const s=document.createElement("div");s.style.cssText="margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;";const o=document.createElement("div"),a=nu();o.innerHTML=`<span style="color: #888;">MIDI Devices:</span> <span id="hud-midi-devices" style="color: #ff00ff;">${a}</span>`,o.style.cssText="font-size: 12px;",s.appendChild(o),n.appendChild(s);const r=py("Enable MIDI Logging",!1,u=>{e({midiLogging:u})});r.title="Log all incoming MIDI messages to console",n.appendChild(r);const c=document.createElement("div");c.style.cssText="margin-top: 10px; padding: 8px; background: rgba(255,255,0,0.1); border-radius: 5px; font-size: 11px; color: #ffff00;",c.innerHTML=`
    <strong>Active MIDI Mappings:</strong><br>
    • Mandala: CC20-23 (symmetry, rings, rotation, scale)<br>
    • Vessel: CC24-26 (layout, opacity, scale)<br>
    • Emoji: CC27-31 (physics, story mode)<br>
    • Global: CC1 (mod wheel) for master control
  `,n.appendChild(c),function(){const l=document.createElement("div");l.style.cssText="margin-top:12px;padding-top:8px;border-top:1px solid #333;",l.innerHTML=`
      <div style="display:flex;align-items:center;gap:10px;">
        <button id="ml-toggle" style="padding:6px 10px;">🎓 MIDI Learn: OFF</button>
        <span style="opacity:.8">Pick a target, toggle Learn, then twist a knob.</span>
      </div>

      <div style="margin-top:10px;display:grid;grid-template-columns:1fr auto;gap:6px;">
        <div>Audio Intensity (0..1)</div>
        <button id="ml-bind-audio" style="padding:4px 8px;">Bind</button>

        <div>Particles → Hue Shift (−180..+180)</div>
        <button id="ml-bind-hue" style="padding:4px 8px;">Bind</button>

        <div>Mandala → Rings (1..8)</div>
        <button id="ml-bind-rings" style="padding:4px 8px;">Bind</button>
      </div>
    `,n.appendChild(l);const h=x=>l.querySelector(x),f=h("#ml-toggle"),m=()=>{f.textContent=`🎓 MIDI Learn: ${window.MidiLearn.active?"ON":"OFF"}`,f.style.background=window.MidiLearn.active?"#225522":""};f.addEventListener("click",()=>{window.MidiLearn.setActive(!window.MidiLearn.active),m()}),m(),h("#ml-bind-audio").addEventListener("click",()=>{window.MidiLearn.setTarget({label:"Audio Intensity",path:"geometry.audioIntensity",min:0,max:1})}),h("#ml-bind-hue").addEventListener("click",()=>{window.MidiLearn.setTarget({label:"Particles Hue Shift",path:"particles.hueShift",min:-180,max:180})}),h("#ml-bind-rings").addEventListener("click",()=>{window.MidiLearn.setTarget({label:"Mandala Rings",path:"mandala.rings",min:1,max:8})})}(),console.log("🎹 MIDI HUD section created")}console.log("📡 hudTelemetry.js loaded");function gy(n){const e=document.createElement("div");e.style.cssText="margin-bottom: 12px;";const t=document.createElement("label");return t.textContent=n,t.style.cssText="display: block; margin-bottom: 5px;",{container:e,label:t}}function xy(n,e,t){const{container:i,label:s}=gy(n),o=document.createElement("input");return o.type="checkbox",o.checked=e,o.style.cssText="margin-left: 10px;",o.addEventListener("change",a=>t(a.target.checked)),i.appendChild(s),s.appendChild(o),i}function yy(n,e){console.log("📡 Creating Telemetry HUD section");const t=document.createElement("hr");t.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(t);const i=document.createElement("h4");i.textContent="📡 Telemetry & Debug",i.style.cssText="margin: 0 0 10px 0; color: #ff9900; font-size: 12px;",n.appendChild(i);const s=xy("Show Telemetry Overlay",!1,a=>{e({telemetryOverlay:a});const r=document.getElementById("telemetry-overlay");r&&(r.style.display=a?"block":"none")});s.title="Show/hide telemetry overlay with FPS, MIDI, morph weights, etc.",n.appendChild(s);const o=document.createElement("div");o.style.cssText="margin-top: 10px; padding: 8px; background: rgba(255,255,0,0.1); border-radius: 5px; font-size: 11px; color: #ffff00;",o.innerHTML=`
    <strong>Performance Metrics:</strong><br>
    FPS and Draw Calls are displayed in the Particles section on the Visual tab.
  `,n.appendChild(o),function(){const r=document.createElement("div");r.style.cssText="margin-top:12px;padding-top:8px;border-top:1px solid #333;",r.innerHTML=`
      <div style="font-weight:600;margin-bottom:6px;">📸 Screenshot</div>

      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <button id="ss-shot" style="padding:6px 10px;">📸 Save PNG</button>

        <label style="display:flex;align-items:center;gap:6px;">
          <input id="ss-posterize" type="checkbox">
          Posterize
        </label>

        <label style="display:flex;align-items:center;gap:8px;">
          Levels
          <input id="ss-levels" type="range" min="2" max="16" step="1" value="6" style="width:160px;">
          <span id="ss-levels-val" style="opacity:.8;">6</span>
        </label>
      </div>
    `,n.appendChild(r);const c=m=>r.querySelector(m),u=c("#ss-shot"),l=c("#ss-posterize"),h=c("#ss-levels"),f=c("#ss-levels-val");h.addEventListener("input",()=>f.textContent=h.value),u.addEventListener("click",()=>{var g,p;const m=parseInt(h.value,10)||6,x=!!l.checked,y=(p=(g=window.Capture)==null?void 0:g.save)==null?void 0:p.call(g,{posterize:x,levels:m});y!=null&&y.ok?console.log(`📸 Screenshot saved (posterize=${x?m:0})`):console.warn("📸 Screenshot failed:",y)})}(),function(){const r=n||document.body;if(!r)return;const c=document.createElement("div");c.style.cssText="margin-top:12px;padding-top:8px;border-top:1px solid #333;",c.innerHTML=`
      <div style="font-weight:600;margin-bottom:6px;">🛰️ Feature Scan</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button id="feat-scan" style="padding:6px 10px;">Scan Now</button>
        <button id="feat-pm" style="padding:6px 10px;">Toggle Projector Mode</button>
        <button id="feat-shot" style="padding:6px 10px;">Screenshot (PNG)</button>
      </div>
      <pre id="feat-out" style="margin-top:8px;max-height:160px;overflow:auto;background:#111;padding:8px;border:1px solid #333;"></pre>
    `,r.appendChild(c);const u=h=>c.querySelector(h),l=u("#feat-out");u("#feat-scan").addEventListener("click",()=>{var f,m;const h=(f=window.debugFeatures)==null?void 0:f.call(window);l.textContent=JSON.stringify((h==null?void 0:h.s)||{},null,2)+((m=h==null?void 0:h.problems)!=null&&m.length?`

Missing:
- ${h.problems.join(`
- `)}`:`

OK: all present`)}),u("#feat-pm").addEventListener("click",()=>{var h;(h=window.ProjectorMode)!=null&&h.toggle?window.ProjectorMode.toggle():console.warn("ProjectorMode not available")}),u("#feat-shot").addEventListener("click",()=>{var f,m;const h=(m=(f=window.Capture)==null?void 0:f.save)==null?void 0:m.call(f,{posterize:!1});h!=null&&h.ok||console.warn("Capture not available or failed",h)})}(),console.log("📡 Telemetry HUD section created")}console.log("💾 hudPresets.js loaded");function vy(n,e){console.log("💾 Creating Presets HUD section");const t=document.createElement("hr");t.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(t);const i=document.createElement("h4");i.textContent="💾 Preset Manager (Phase 11.2.4)",i.style.cssText="margin: 0 0 10px 0; color: #00ffff; font-size: 12px;",n.appendChild(i);const s=document.createElement("div");s.style.cssText="margin-bottom: 10px;";const o=document.createElement("input");o.type="text",o.placeholder="New preset name...",o.style.cssText="width: 58%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-right: 2%;";const a=document.createElement("button");a.textContent="Save New",a.style.cssText="width: 38%; padding: 4px; background: #00ff00; color: black; border: none; cursor: pointer; font-weight: bold;",a.title="Save current state as new preset";const r=document.createElement("input");r.type="text",r.placeholder="Category (e.g., Live, Test)",r.value="Uncategorized",r.style.cssText="width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-top: 5px; font-size: 11px;";const c=document.createElement("input");c.type="text",c.placeholder="Tags (comma-separated, e.g., bright, fast)",c.style.cssText="width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-top: 5px; font-size: 11px;",a.addEventListener("click",()=>{const ee=o.value.trim();if(ee){const pe=r.value.trim()||"Uncategorized",Te=c.value.trim()?c.value.split(",").map(Ae=>Ae.trim()).filter(Ae=>Ae.length>0):[];console.log("💾 [HUD] Save button clicked:",{presetName:ee,category:pe,tags:Te}),e({presetAction:"save",presetName:ee,category:pe,tags:Te}),o.value="",r.value="Uncategorized",c.value=""}else console.warn("💾 [HUD] Save button clicked but preset name is empty")}),s.appendChild(o),s.appendChild(a),s.appendChild(r),s.appendChild(c),n.appendChild(s);const u=document.createElement("div");u.style.cssText="margin-bottom: 10px;";const l=document.createElement("div");l.textContent="Search Presets:",l.style.cssText="margin-bottom: 3px; color: #aaa; font-size: 10px;";const h=document.createElement("input");h.type="text",h.placeholder="Search by name, category, or tags...",h.style.cssText="width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-bottom: 8px; font-size: 11px;";const f=document.createElement("div");f.textContent="Filter by Category:",f.style.cssText="margin-bottom: 3px; color: #aaa; font-size: 10px;";const m=document.createElement("select");m.style.cssText="width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; margin-bottom: 5px; font-size: 11px;";const x=document.createElement("div");x.textContent="Filter by Tags (comma-separated):",x.style.cssText="margin-bottom: 3px; color: #aaa; font-size: 10px;";const y=document.createElement("input");y.type="text",y.placeholder="e.g., bright, fast",y.style.cssText="width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555; font-size: 11px;",u.appendChild(l),u.appendChild(h),u.appendChild(f),u.appendChild(m),u.appendChild(x),u.appendChild(y),n.appendChild(u);const g=document.createElement("div");g.textContent="Saved Presets:",g.style.cssText="margin-bottom: 5px; color: #aaa; font-size: 11px;",n.appendChild(g);const p=document.createElement("div");p.id="preset-list-container",p.style.cssText=`
    max-height: 150px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #555;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 5px;
  `,n.appendChild(p);const _=document.createElement("div");_.style.cssText="display: flex; gap: 5px; margin-bottom: 10px;";const v=document.createElement("button");v.textContent="Load",v.style.cssText="flex: 1; padding: 6px; background: #0088ff; color: white; border: none; cursor: pointer; border-radius: 3px;",v.title="Load selected preset",v.disabled=!0;const b=document.createElement("button");b.textContent="Update",b.style.cssText="flex: 1; padding: 6px; background: #ff9900; color: white; border: none; cursor: pointer; border-radius: 3px;",b.title="Overwrite selected preset with current state",b.disabled=!0;const P=document.createElement("button");P.textContent="Delete",P.style.cssText="flex: 1; padding: 6px; background: #ff4444; color: white; border: none; cursor: pointer; border-radius: 3px;",P.title="Delete selected preset",P.disabled=!0,v.addEventListener("click",()=>{}),b.addEventListener("click",()=>{}),P.addEventListener("click",()=>{}),_.appendChild(v),_.appendChild(b),_.appendChild(P),n.appendChild(_);const C=document.createElement("div");C.style.cssText="margin-bottom: 10px; padding: 8px; background: rgba(0, 100, 150, 0.1); border: 1px solid #0066aa; border-radius: 4px;";const A=document.createElement("div");A.textContent="🎚️ Preset Interpolation",A.style.cssText="margin-bottom: 5px; color: #00aaff; font-size: 11px; font-weight: bold;";const F=document.createElement("label");F.style.cssText="display: flex; align-items: center; margin-bottom: 5px; font-size: 11px; cursor: pointer;";const w=document.createElement("input");w.type="checkbox",w.checked=d.interpolation.enabled,w.style.cssText="margin-right: 8px;";const S=document.createElement("span");S.textContent=d.interpolation.enabled?"Enabled":"Disabled",S.style.cssText=`color: ${d.interpolation.enabled?"#00ff00":"#ff6666"};`,w.addEventListener("change",()=>{d.interpolation.enabled=w.checked,S.textContent=w.checked?"Enabled":"Disabled",S.style.color=w.checked?"#00ff00":"#ff6666",console.log(`🎚️ Interpolation ${w.checked?"enabled":"disabled"}`)}),F.appendChild(w),F.appendChild(S);const R=document.createElement("div");R.textContent=`Duration: ${d.interpolation.duration}ms`,R.style.cssText="margin-bottom: 3px; color: #aaa; font-size: 10px;";const N=document.createElement("input");N.type="range",N.min="500",N.max="10000",N.step="500",N.value=d.interpolation.duration,N.style.cssText="width: 100%; margin-bottom: 3px;",N.addEventListener("input",()=>{const ee=parseInt(N.value);d.interpolation.duration=ee,R.textContent=`Duration: ${ee}ms`}),C.appendChild(A),C.appendChild(F),C.appendChild(R),C.appendChild(N),n.appendChild(C);const k=document.createElement("hr");k.style.cssText="border: 1px solid #555; margin: 15px 0;",n.appendChild(k);const G=document.createElement("div");G.className="panel-section",G.style.cssText="margin-bottom: 10px;";const X=document.createElement("div");X.style.cssText="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;";const Y=document.createElement("div");Y.className="panel-title",Y.textContent="🔗 Morph Chain",Y.style.cssText="color: #ff9900; font-size: 12px; font-weight: bold;";const J=document.createElement("div");J.id="chainStatusBadge",J.textContent="⏹ Stopped",J.style.cssText="padding: 3px 8px; background: #333; color: #888; border-radius: 3px; font-size: 9px; font-weight: bold;",X.appendChild(Y),X.appendChild(J),G.appendChild(X);const V=document.createElement("div");V.style.display="flex",V.style.flexDirection="column",V.style.gap="6px",V.style.maxHeight="150px",V.style.overflowY="auto",V.style.marginBottom="8px",V.style.padding="5px",V.style.background="#222",V.style.border="1px solid #555",G.appendChild(V);const ae=document.createElement("div");ae.style.display="flex",ae.style.alignItems="center",ae.style.gap="8px",ae.style.marginBottom="8px";const ce=document.createElement("span");ce.textContent="Duration (ms):",ce.style.fontSize="10px",ce.style.color="#aaa";const ue=document.createElement("input");ue.type="range",ue.min="500",ue.max="10000",ue.step="500",ue.value="2000",ue.style.flex="1";const Fe=document.createElement("span");Fe.textContent="2000",Fe.style.fontSize="10px",Fe.style.color="#fff",Fe.style.minWidth="45px",ue.addEventListener("input",()=>Fe.textContent=ue.value),ae.appendChild(ce),ae.appendChild(ue),ae.appendChild(Fe),G.appendChild(ae);const He=document.createElement("div");He.style.display="flex",He.style.gap="15px",He.style.marginBottom="8px",He.style.fontSize="10px";const q=document.createElement("label");q.style.display="flex",q.style.alignItems="center",q.style.gap="5px",q.style.cursor="pointer";const te=document.createElement("input");te.type="checkbox",te.id="chainLoopToggle",q.appendChild(te),q.appendChild(document.createTextNode("🔁 Loop"));const re=document.createElement("label");re.style.display="flex",re.style.alignItems="center",re.style.gap="5px",re.style.cursor="pointer";const O=document.createElement("input");O.type="checkbox",O.id="chainShuffleToggle",re.appendChild(O),re.appendChild(document.createTextNode("🔀 Shuffle")),He.appendChild(q),He.appendChild(re),G.appendChild(He);const fe=document.createElement("div");fe.style.marginBottom="8px";const Me=document.createElement("div");Me.textContent="Progress: —",Me.id="chainProgressLabel",Me.style.fontSize="10px",Me.style.color="#aaa",Me.style.marginBottom="3px";const Ie=document.createElement("div");Ie.style.width="100%",Ie.style.height="8px",Ie.style.background="#333",Ie.style.border="1px solid #555",Ie.style.position="relative";const L=document.createElement("div");L.id="chainProgressFill",L.style.width="0%",L.style.height="100%",L.style.background="#00ff00",L.style.transition="width 0.1s linear",Ie.appendChild(L),fe.appendChild(Me),fe.appendChild(Ie),fe.id="chainProgressContainer",fe.style.display="none",G.appendChild(fe);const Ge=document.createElement("div");Ge.style.display="flex",Ge.style.gap="8px",Ge.style.marginBottom="8px";const Ce=document.createElement("button");Ce.id="chainStartBtn",Ce.textContent="Start Chain",Ce.style.cssText="flex: 1; padding: 6px; background: #00ff00; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 11px;";const Ne=document.createElement("button");Ne.id="chainStopBtn",Ne.textContent="Stop",Ne.style.cssText="flex: 1; padding: 6px; background: #ff6666; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 11px;",Ne.disabled=!0,Ne.style.opacity="0.5",Ne.style.cursor="not-allowed";const ge=document.createElement("button");ge.id="chainResetBtn",ge.textContent="🔄",ge.title="Reset Chain",ge.style.cssText="flex: 0.5; padding: 6px; background: #ffaa00; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 11px;",Ge.appendChild(Ce),Ge.appendChild(Ne),Ge.appendChild(ge),G.appendChild(Ge);const Xe=document.createElement("div");Xe.style.cssText="display: flex; gap: 5px; margin-bottom: 8px;";const ve=document.createElement("button");ve.id="chainPauseResumeBtn",ve.textContent="⏸ Pause",ve.style.cssText="flex: 2; padding: 6px; background: #ffaa00; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 11px;",ve.disabled=!0,ve.style.opacity="0.5",ve.style.cursor="not-allowed";const be=document.createElement("button");be.id="chainSkipPrevBtn",be.textContent="⏮",be.style.cssText="flex: 1; padding: 6px; background: #6699ff; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 11px;",be.disabled=!0,be.style.opacity="0.5",be.style.cursor="not-allowed";const je=document.createElement("button");je.id="chainSkipNextBtn",je.textContent="⏭",je.style.cssText="flex: 1; padding: 6px; background: #6699ff; color: white; border: none; cursor: pointer; font-weight: bold; font-size: 11px;",je.disabled=!0,je.style.opacity="0.5",je.style.cursor="not-allowed",Xe.appendChild(be),Xe.appendChild(ve),Xe.appendChild(je),G.appendChild(Xe);const T=document.createElement("div");T.id="chainTimeRemaining",T.textContent="Remaining: --",T.style.cssText="font-size: 10px; color: #aaa; margin-bottom: 8px; text-align: center;",G.appendChild(T);const M=document.createElement("div");M.style.display="flex",M.style.gap="5px",M.style.marginBottom="8px";const j=document.createElement("input");j.type="text",j.placeholder="Chain name...",j.style.cssText="flex: 1; padding: 4px; background: #333; color: white; border: 1px solid #555; font-size: 10px;";const Q=document.createElement("button");Q.textContent="💾 Save Chain",Q.style.cssText="padding: 4px 8px; background: #ff9900; color: black; border: none; cursor: pointer; font-weight: bold; font-size: 10px;",M.appendChild(j),M.appendChild(Q),G.appendChild(M);const ne=document.createElement("div");ne.style.cssText="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;";const ie=document.createElement("div");ie.textContent="Saved Chains:",ie.style.cssText="font-size: 10px; color: #aaa;";const Le=document.createElement("div");Le.style.cssText="display: flex; gap: 5px;";const he=document.createElement("button");he.id="exportChainsBtn",he.textContent="💾",he.title="Export chains",he.style.cssText="padding: 2px 6px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 10px; border-radius: 3px;";const de=document.createElement("button");de.id="importChainsBtn",de.textContent="📂",de.title="Import chains",de.style.cssText="padding: 2px 6px; background: #2196F3; color: white; border: none; cursor: pointer; font-size: 10px; border-radius: 3px;";const Be=document.createElement("input");Be.type="file",Be.id="importChainsInput",Be.accept=".json",Be.style.display="none",Le.appendChild(he),Le.appendChild(de),Le.appendChild(Be),ne.appendChild(ie),ne.appendChild(Le),G.appendChild(ne);const se=document.createElement("div");se.id="savedChainsList",se.style.cssText="max-height: 100px; overflow-y: auto; background: #222; border: 1px solid #555; padding: 5px; margin-bottom: 8px;",G.appendChild(se);const we=document.createElement("button");we.textContent="♻️ Reset",we.style.cssText="width: 100%; margin-top: 8px; background: #222; color: #fff; border: 1px solid #444; padding: 6px; cursor: pointer; font-size: 11px; font-weight: bold;",we.addEventListener("click",()=>{console.log("♻️ HUD reset clicked"),e({type:"app:reset"})}),G.appendChild(we),n.appendChild(G);function Je(){V.innerHTML="";const ee=window.__PRESET_NAMES__?window.__PRESET_NAMES__():[];if(ee.length===0){const pe=document.createElement("div");pe.textContent="No presets available",pe.style.cssText="color: #888; font-size: 10px; padding: 5px;",V.appendChild(pe);return}ee.forEach(pe=>{const Te=document.createElement("label");Te.style.display="flex",Te.style.alignItems="center",Te.style.gap="6px",Te.style.cursor="pointer",Te.style.fontSize="10px";const Ae=document.createElement("input");Ae.type="checkbox",Ae.value=pe,Te.appendChild(Ae),Te.appendChild(document.createTextNode(pe)),V.appendChild(Te)})}function De(){se.innerHTML="",Pe(async()=>{const{listChains:ee,getChainData:pe}=await Promise.resolve().then(()=>id);return{listChains:ee,getChainData:pe}},void 0,import.meta.url).then(({listChains:ee,getChainData:pe})=>{const Te=ee();if(Te.length===0){const Ae=document.createElement("div");Ae.textContent="No saved chains",Ae.style.cssText="color: #888; font-size: 9px; padding: 3px;",se.appendChild(Ae);return}Te.forEach(Ae=>{const Ve=pe(Ae),ht=document.createElement("div");ht.style.cssText="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; font-size: 9px;";const yt=document.createElement("span");yt.textContent=`${Ae} (${Ve.presets.length})`,yt.style.cssText="flex: 1; color: #ccc;",yt.title=`Presets: ${Ve.presets.join(", ")}
Duration: ${Ve.duration}ms
Loop: ${Ve.loop}
Shuffle: ${Ve.shuffle}`;const Et=document.createElement("button");Et.textContent="Load",Et.style.cssText="padding: 2px 6px; background: #00aaff; color: white; border: none; cursor: pointer; font-size: 8px; margin-right: 3px;",Et.addEventListener("click",()=>{console.log("🔗 Loading chain:",Ae),e({presetAction:"chain:load",chainName:Ae})});const tn=document.createElement("button");tn.textContent="×",tn.style.cssText="padding: 2px 6px; background: #ff6666; color: white; border: none; cursor: pointer; font-size: 8px;",tn.addEventListener("click",()=>{confirm(`Delete chain "${Ae}"?`)&&(console.log("🔗 Deleting chain:",Ae),e({presetAction:"chain:delete",chainName:Ae}),De())}),ht.appendChild(yt),ht.appendChild(Et),ht.appendChild(tn),se.appendChild(ht)})})}Ce.addEventListener("click",()=>{const ee=[...V.querySelectorAll("input[type=checkbox]:checked")].map(Ve=>Ve.value);if(ee.length===0){alert("⚠️ No presets selected. Please select at least one preset before starting a chain.");return}const pe=Number(ue.value)||2e3,Te=te.checked,Ae=O.checked;console.log("🔗 HUD start chain:",ee,pe,{loop:Te,shuffle:Ae}),e({presetAction:"chain:start",chainPresets:ee,chainDuration:pe,chainLoop:Te,chainShuffle:Ae})}),Ne.addEventListener("click",()=>{console.log("🔗 HUD stop chain"),e({presetAction:"chain:stop"})}),ge.addEventListener("click",()=>{console.log("🔄 HUD reset chain"),e({presetAction:"chain:reset"})}),ve.addEventListener("click",()=>{ve.textContent.includes("Resume")?(console.log("▶️ HUD resume chain"),e({presetAction:"chain:resume"})):(console.log("⏸ HUD pause chain"),e({presetAction:"chain:pause"}))}),be.addEventListener("click",()=>{console.log("⏮ HUD skip to previous preset"),e({presetAction:"chain:skipPrev"})}),je.addEventListener("click",()=>{console.log("⏭ HUD skip to next preset"),e({presetAction:"chain:skipNext"})}),he.addEventListener("click",()=>{console.log("💾 HUD export chains"),e({presetAction:"chain:export"})}),de.addEventListener("click",()=>{Be.click()}),Be.addEventListener("change",ee=>{const pe=ee.target.files[0];pe&&(console.log("📂 HUD import chains:",pe.name),e({presetAction:"chain:import",file:pe}),Be.value="")}),Q.addEventListener("click",()=>{const ee=j.value.trim();if(!ee){console.warn("🔗 Chain name is empty");return}const pe=[...V.querySelectorAll("input[type=checkbox]:checked")].map(ht=>ht.value);if(pe.length<2){console.warn("🔗 Need at least 2 presets to save a chain");return}const Te=Number(ue.value)||2e3,Ae=te.checked,Ve=O.checked;console.log("🔗 HUD save chain:",ee,pe,{duration:Te,loop:Ae,shuffle:Ve}),e({presetAction:"chain:save",chainName:ee,chainPresets:pe,chainDuration:Te,chainLoop:Ae,chainShuffle:Ve}),j.value="",setTimeout(De,100)});function ye(){const ee=document.getElementById("chainProgressContainer"),pe=document.getElementById("chainProgressLabel"),Te=document.getElementById("chainProgressFill"),Ae=document.getElementById("chainStatusBadge");if(!pe||!Te||!ee||!Ae)return;const Ve=d.morphChain;if(!Ve||!Ve.active){ee.style.display="none",pe.textContent="Step —",Te.style.width="0%",Ae.textContent="⏹ Stopped",Ae.style.background="#333",Ae.style.color="#888";const si=document.querySelector("#chainStartBtn"),zn=document.querySelector("#chainStopBtn");si&&zn&&(si.disabled=!1,si.style.opacity="1",si.style.cursor="pointer",zn.disabled=!0,zn.style.opacity="0.5",zn.style.cursor="not-allowed");return}const{currentIndex:ht,presets:yt,duration:Et,stepStartTime:tn}=Ve,on=yt.length;if(!yt||on===0){ee.style.display="none";return}const Cn=performance.now()-(tn||performance.now()),On=Math.min(Cn/Et,1),ni=(ht+On)/on,Bn=Math.round(ni*100),Zi=Math.min(ht+1,on);Te.style.width=`${Bn}%`,pe.textContent=`Step ${Zi}/${on} (${Bn}%)`,ee.style.display="block",Ae.textContent="🟢 Running",Ae.style.background="#004400",Ae.style.color="#00ff00";const kn=document.querySelector("#chainStartBtn"),ii=document.querySelector("#chainStopBtn");kn&&ii&&(kn.disabled=!0,kn.style.opacity="0.5",kn.style.cursor="not-allowed",ii.disabled=!1,ii.style.opacity="1",ii.style.cursor="pointer")}const Ye=document.createElement("div");Ye.id="chainToastContainer",Ye.style.cssText="position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; pointer-events: none;",document.body.appendChild(Ye);function We(ee,pe=1500){const Te=document.createElement("div");Te.style.cssText="background: rgba(0, 0, 0, 0.9); color: white; padding: 12px 16px; border-radius: 4px; border-left: 4px solid #ff9900; font-size: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); max-width: 300px; pointer-events: auto; animation: slideInRight 0.3s ease;",Te.textContent=ee,Ye.appendChild(Te),setTimeout(()=>{Te.style.opacity="0",Te.style.transition="opacity 0.3s ease",setTimeout(()=>Te.remove(),300)},pe)}const ut=document.createElement("style");ut.textContent=`
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,document.head.appendChild(ut),window.addEventListener("chainStarted",ee=>{const{presets:pe}=ee.detail;We(`🔗 Chain started: ${pe.join(" → ")}`)}),window.addEventListener("chainStepComplete",ee=>{const{next:pe}=ee.detail;We(`✅ Step complete → Next: ${pe}`)}),window.addEventListener("chainLoopRestarted",()=>{We("🔁 Loop restarted")}),window.addEventListener("chainFinished",()=>{We("🔗 Chain finished")}),window.addEventListener("chainStarted",()=>{ve.disabled=!1,ve.style.opacity="1",ve.style.cursor="pointer",ve.textContent="⏸ Pause",be.disabled=!1,be.style.opacity="1",be.style.cursor="pointer",je.disabled=!1,je.style.opacity="1",je.style.cursor="pointer",Ne.disabled=!1,Ne.style.opacity="1",Ne.style.cursor="pointer",ge.disabled=!1,ge.style.opacity="1",ge.style.cursor="pointer",Ce.disabled=!0,Ce.style.opacity="0.5",Ce.style.cursor="not-allowed"}),window.addEventListener("chainFinished",()=>{ve.disabled=!0,ve.style.opacity="0.5",ve.style.cursor="not-allowed",ve.textContent="⏸ Pause",be.disabled=!0,be.style.opacity="0.5",be.style.cursor="not-allowed",je.disabled=!0,je.style.opacity="0.5",je.style.cursor="not-allowed",Ne.disabled=!0,Ne.style.opacity="0.5",Ne.style.cursor="not-allowed",ge.disabled=!0,ge.style.opacity="0.5",ge.style.cursor="not-allowed",Ce.disabled=!1,Ce.style.opacity="1",Ce.style.cursor="pointer",T.textContent="Remaining: --"}),window.addEventListener("chainPaused",()=>{ve.textContent="▶️ Resume",We("⏸ Chain paused")}),window.addEventListener("chainResumed",()=>{ve.textContent="⏸ Pause",We("▶️ Chain resumed")}),window.addEventListener("chainSkipped",ee=>{const{direction:pe,preset:Te}=ee.detail;We(`${pe==="next"?"⏭":"⏮"} Skipped → ${Te}`)}),window.addEventListener("chainReset",()=>{We("♻️ Chain reset to start"),ve.disabled=!0,ve.style.opacity="0.5",ve.style.cursor="not-allowed",ve.textContent="⏸ Pause",be.disabled=!0,be.style.opacity="0.5",be.style.cursor="not-allowed",je.disabled=!0,je.style.opacity="0.5",je.style.cursor="not-allowed",Ne.disabled=!0,Ne.style.opacity="0.5",Ne.style.cursor="not-allowed",ge.disabled=!0,ge.style.opacity="0.5",ge.style.cursor="not-allowed",Ce.disabled=!1,Ce.style.opacity="1",Ce.style.cursor="pointer"}),window.addEventListener("chainStopped",()=>{We("⏹ Chain stopped"),ve.disabled=!0,ve.style.opacity="0.5",ve.style.cursor="not-allowed",ve.textContent="⏸ Pause",be.disabled=!0,be.style.opacity="0.5",be.style.cursor="not-allowed",je.disabled=!0,je.style.opacity="0.5",je.style.cursor="not-allowed",Ne.disabled=!0,Ne.style.opacity="0.5",Ne.style.cursor="not-allowed",ge.disabled=!0,ge.style.opacity="0.5",ge.style.cursor="not-allowed",Ce.disabled=!1,Ce.style.opacity="1",Ce.style.cursor="pointer",T.textContent="Remaining: --"});let I=null;window.addEventListener("chainStarted",()=>{I&&clearInterval(I),I=setInterval(()=>{Pe(async()=>{const{getChainProgress:ee}=await Promise.resolve().then(()=>id);return{getChainProgress:ee}},void 0,import.meta.url).then(({getChainProgress:ee})=>{const pe=ee();if(pe){const Te=pe.timeRemaining,Ae=Math.floor(Te/6e4),Ve=Math.floor(Te%6e4/1e3);T.textContent=`Remaining: ${Ae}m ${Ve}s`}else T.textContent="Remaining: --",I&&(clearInterval(I),I=null)})},100)}),window.addEventListener("chainFinished",()=>{I&&(clearInterval(I),I=null)}),window.addEventListener("chainProgress",ee=>{const{step:pe,total:Te,percent:Ae,remaining:Ve}=ee.detail,ht=document.getElementById("chainProgressFill"),yt=document.getElementById("chainProgressLabel"),Et=document.getElementById("chainProgressContainer");ht&&yt&&Et&&(ht.style.width=`${Ae}%`,yt.textContent=`Step ${pe}/${Te} (${Ae}%) — Remaining: ${Ve}s`,Et.style.display="block")}),setInterval(ye,100),Je(),De(),document.addEventListener("presetsImported",Je),document.addEventListener("presetSaved",Je),document.addEventListener("presetDeleted",Je);const me=document.createElement("div");me.style.cssText="display: flex; gap: 5px; margin-bottom: 10px;";const K=document.createElement("button");K.textContent="📥 Export",K.style.cssText="flex: 1; padding: 6px; background: #00aa00; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 11px;",K.title="Export all presets as JSON file";const Z=document.createElement("button");Z.textContent="📤 Import",Z.style.cssText="flex: 1; padding: 6px; background: #aa00aa; color: white; border: none; cursor: pointer; border-radius: 3px; font-size: 11px;",Z.title="Import presets from JSON file";const oe=document.createElement("input");oe.type="file",oe.accept=".json,application/json",oe.style.display="none",K.addEventListener("click",()=>{e({presetAction:"export"})}),Z.addEventListener("click",()=>{oe.click()}),oe.addEventListener("change",ee=>{const pe=ee.target.files[0];pe&&(e({presetAction:"import",file:pe}),oe.value="")}),me.appendChild(K),me.appendChild(Z),me.appendChild(oe),n.appendChild(me),m.addEventListener("change",()=>{Pe(async()=>{const{listPresets:ee}=await Promise.resolve().then(()=>vi);return{listPresets:ee}},void 0,import.meta.url).then(({listPresets:ee})=>{lo(ee())})}),y.addEventListener("input",()=>{Pe(async()=>{const{listPresets:ee}=await Promise.resolve().then(()=>vi);return{listPresets:ee}},void 0,import.meta.url).then(({listPresets:ee})=>{lo(ee())})}),h.addEventListener("input",()=>{Pe(async()=>{const{listPresets:ee}=await Promise.resolve().then(()=>vi);return{listPresets:ee}},void 0,import.meta.url).then(({listPresets:ee})=>{lo(ee())})}),console.log("💾 Presets HUD section created")}console.log("🌑 shadows.js loaded");let pi=null,vn=null,Hi=null;function _y(n){console.log("🌑 Initializing multi-plane shadow system (v2.2.0)..."),Hi=new Yi({color:d.shadows.color,transparent:!0,opacity:d.shadows.opacity,depthWrite:!1});const e=new zr(3,64);pi=new Pt(e,Hi),pi.rotation.x=-Math.PI/2,pi.position.y=-1.2,pi.visible=d.shadows.enabled&&d.shadows.ground,n.add(pi);const t=new bi(8,8);vn=new Pt(t,Hi.clone()),vn.position.z=-4,vn.visible=d.shadows.enabled&&d.shadows.backdrop,n.add(vn),console.log("✅ Multi-plane shadow system initialized")}function Sy(n){if(!pi||!vn||!Hi)return;pi.visible=d.shadows.enabled&&d.shadows.ground,vn.visible=d.shadows.enabled&&d.shadows.backdrop;const e=d.colorLayers.shadows,t=Ki(),i=(t.bass+t.mid+t.treble)/3;let s=e.baseColor;if(d.audioReactive){s=Ca(e.baseColor,e.audioColor,e.audioIntensity,i),Math.random()<.02&&console.log(`🌑 Shadows: base=${e.baseColor} audio=${e.audioColor} final=${s}`);const a=(t.bass||0)*.1,r=d.shadows.opacity;if(Hi.opacity=Math.max(0,Math.min(1,r+a)),vn.visible){const c=(t.mid||0)*.05;vn.material.opacity=Math.max(0,Math.min(1,r+c))}}else Hi.opacity=d.shadows.opacity,vn.material.opacity=d.shadows.opacity;Hi.color.set(s),vn.material.color.set(s);const o=d.vessel.scale||1;pi.scale.setScalar(o),vn.scale.setScalar(o)}console.log("🌑 Enhanced shadow module ready");const su=(()=>{const n=window.spritesConfig||(window.spritesConfig={});return n.gain??(n.gain=1.35),n.bassScale??(n.bassScale=.9),n.midSpin??(n.midSpin=.65),n.trebleJit??(n.trebleJit=.8),n.levelAlpha??(n.levelAlpha=.7),n.smoothing??(n.smoothing=.12),n.minLevel??(n.minLevel=.002),n})(),Rn={bass:0,mid:0,treble:0,level:0,t:0};function Jo(n,e,t){return n+(e-n)*t}function My(n=.016){const e=(d==null?void 0:d.audio)||{bass:0,mid:0,treble:0,level:0},t=Math.max(1e-4,Math.min(1,su.smoothing));return Rn.bass=Jo(Rn.bass,e.bass,t),Rn.mid=Jo(Rn.mid,e.mid,t),Rn.treble=Jo(Rn.treble,e.treble,t),Rn.level=Jo(Rn.level,e.level,t),Rn.t+=n,Rn}function by(n){var t,i;if(n.__sprArInit)return;n.__sprArInit=!0,n.__baseScale=((t=n.scale)==null?void 0:t.x)||1,n.__baseOpacity=((i=n.material)==null?void 0:i.opacity)??1;const e=n.id||Math.random()*1e6;n.__phase=e*.318309886%(Math.PI*2)}function wy(n,e=.016){const t=My(e),i=su;if(t.level<i.minLevel)return;const s=i.gain,o=i.bassScale*s,a=i.midSpin*s,r=i.trebleJit*s,c=i.levelAlpha*s;for(let u=0;u<n.length;u++){const l=n[u];if(!l)continue;by(l);const h=1+t.bass*o;l.scale.setScalar(l.__baseScale*h),l.rotation&&(l.rotation.z+=t.mid*a*e*6);const f=l.__phase+t.t*30,m=t.treble*r*.02;if(l.position&&(l.position.x+=Math.sin(f)*m,l.position.y+=Math.cos(f*1.3)*m),l.material){const x=l.__baseOpacity,y=.6+t.level*c;l.material.transparent=!0,l.material.opacity=Math.max(0,Math.min(1,x*y)),"needsUpdate"in l.material&&(l.material.needsUpdate=!0)}}}let $t,Ar,Zo=!1;function Kr(n){Ar=n,$t=new ws;const e=new kr({color:d.color,transparent:!0,opacity:.4}),t=d.sprites.count||200;for(let i=0;i<t;i++){const s=new Hd(e.clone());s.position.set((Math.random()-.5)*10,(Math.random()-.5)*10,(Math.random()-.5)*10),s.scale.set(.1,.1,.1),$t.add(s)}$t.visible=d.sprites.enabled,n.add($t),console.log(`✨ Sprites initialized (count: ${t}, enabled: ${d.sprites.enabled})`),lu({pool:$t.children,group:$t})}function ou(){if(!$t||($t.visible=d.sprites.enabled,!d.sprites.enabled))return;const{bass:n,mid:e,treble:t,level:i}=Ki(),s=(n+e+t)/3;!d.audioReactive&&!Zo?(window.__HUD_AUDIO_LOGS__&&console.log("🎵 Sprites update clamped to base (audio OFF)"),Zo=!0):d.audioReactive&&Zo&&(Zo=!1),$t.children.forEach((o,a)=>{var h,f,m,x,y,g;const r=Date.now()*.001+a;let c=0,u=0,l=0;d.audioReactive&&d.morphAudioWeights?(c=(((h=d.morphBaseWeights)==null?void 0:h[0])||0)+(d.morphAudioWeights[0]||0),u=(((f=d.morphBaseWeights)==null?void 0:f[1])||0)+(d.morphAudioWeights[1]||0),l=(((m=d.morphBaseWeights)==null?void 0:m[2])||0)+(d.morphAudioWeights[2]||0)):(c=((x=d.morphBaseWeights)==null?void 0:x[0])||0,u=((y=d.morphBaseWeights)==null?void 0:y[1])||0,l=((g=d.morphBaseWeights)==null?void 0:g[2])||0),o.position.x=Math.sin(r)*(2+c*3),o.position.y=Math.cos(r)*(2+u*3),o.position.z=Math.sin(r*.5)*(2+l*3),o.material.color.set(d.color),o.material.opacity=d.audioReactive?.2+s*.8:.2}),d.audioReactive&&wy($t.children,.016)}function au(){!$t||!Ar||(Ar.remove($t),$t.children.forEach(n=>{n.material&&n.material.dispose()}),$t.clear(),$t=null,console.log("✨ Sprites destroyed"))}function Ey(n){au(),Kr(n)}let ru=!1,Ft=null;const Vt=window.SpritesReactConfig={attack:.35,release:.12,agcDecay:.985,agcFloor:.15,sizeMulBase:.85,sizeMulAmp:1.1,opacityBase:.45,opacityAmp:.55,spawnBase:.3,spawnAmp:1.7,hueAmp:140,beatThresh:.48,beatHoldMs:140,beatBoostSize:.35,beatBoostSpawn:1.2,beatFlash:.35};let Zt={level:0,bass:0,mid:0,treble:0},mr=.2,Jc=0;function Qo(n,e){const t=e>n?Vt.attack:Vt.release;return n+t*(e-n)}function lu(n){ru=!0,Ft=n||Ft||{},console.log("✨ Sprites audio-reactive bridge armed (13.10b)")}function cu(n={}){var m,x,y,g;if(!ru||!Ft)return;const e=Math.max(0,Math.min(1,n.level??0));mr=Math.max(mr*Vt.agcDecay,e,Vt.agcFloor);const t=p=>(p??0)/(mr||1e-6),i=t(n.bass),s=t(n.mid),o=t(n.treble),a=t(n.level);Zt.bass=Qo(Zt.bass,Math.min(i,1)),Zt.mid=Qo(Zt.mid,Math.min(s,1)),Zt.treble=Qo(Zt.treble,Math.min(o,1)),Zt.level=Qo(Zt.level,Math.min(a,1));let r=0;const c=performance.now();Zt.bass>Vt.beatThresh&&c-Jc>Vt.beatHoldMs&&(r=1,Jc=c);const u=Vt.sizeMulBase+Vt.sizeMulAmp*Zt.level+r*Vt.beatBoostSize,l=(Zt.treble-Zt.bass)*Vt.hueAmp,h=Vt.spawnBase+Vt.spawnAmp*Zt.mid+r*Vt.beatBoostSpawn,f=Vt.opacityBase+Vt.opacityAmp*Zt.level+r*Vt.beatFlash;try{if((m=Ft.setSizeMultiplier)==null||m.call(Ft,u),(x=Ft.setHueShift)==null||x.call(Ft,l),(y=Ft.setSpawnRate)==null||y.call(Ft,h),(g=Ft.setOpacity)==null||g.call(Ft,Math.min(1,f)),Ft.pool&&Array.isArray(Ft.pool))for(const p of Ft.pool)p&&(p.setSize&&p.setSize((p.baseSize||1)*u),p.setHue&&p.setHue(((p.baseHue||0)+l)%360),p.setAlpha&&p.setAlpha(Math.max(0,Math.min(1,f))))}catch{}}const Cy=Object.freeze(Object.defineProperty({__proto__:null,applyAudioBandsToSprites:cu,destroySprites:au,initSprites:Kr,markSpritesReady:lu,reinitSprites:Ey,updateSprites:ou},Symbol.toStringTag,{value:"Module"})),Fi=7,Zc={Major:[0,2,4,5,7,9,11],Minor:[0,2,3,5,7,8,10],Pentatonic:[0,2,4,7,9],Dorian:[0,2,3,5,7,9,10],Phrygian:[0,1,3,5,7,8,10],Lydian:[0,2,4,6,7,9,11],Mixolydian:[0,2,4,5,7,9,10],Chromatic:[0,1,2,3,4,5,6,7,8,9,10,11]},Ty=[0,7,2,9,4,11,6,1,8,3,10,5];class Aa{constructor(e,t=5e3){this.scene=e,this.count=t,this.angles=new Float32Array(this.count),this.radii=new Float32Array(this.count),this.velocities=new Float32Array(this.count*3),this.targets=new Float32Array(this.count*3),this.orbitalSpeed=.05,this.smoothness=.5,this.opacity=1,this.organicStrength=.2,this.driftOffsets=[];for(let c=0;c<this.count;c++)this.driftOffsets.push({x:Math.random()*Math.PI*2,y:Math.random()*Math.PI*2,z:Math.random()*Math.PI*2,s:.6+Math.random()*.8,ax:.6+Math.random()*.8,ay:.6+Math.random()*.8,az:.6+Math.random()*.8,a2:.3+Math.random()*.5});this.hueShift=0,this.audioReactive=!0,this.audioLevel=0,this.audioGain=2,this.sizeWorld=.5,this.currentLayout="orbit",this.vesselGroup=null,this.trailEnabled=!1,this.trailLength=0,this.trailOpacity=.3,this.trailFade=1,this.trailAudioReactive=!1,this.trailLengthMin=2,this.trailLengthMax=10,this.trailHistory=[],this.maxTrailLength=20;const i=new Gr(1,6,6);this.uniforms={uSize:{value:this.sizeWorld},uOpacity:{value:this.opacity},uHueShift:{value:this.hueShift},uAudioReactive:{value:this.audioReactive},uAudioLevel:{value:0},uBrightnessBoost:{value:1}};const s=`
      uniform float uSize;
      uniform float uHueShift;
      uniform bool  uAudioReactive;
      uniform float uAudioLevel;

      attribute float aBaseHue;
      attribute float aPhase;

      varying float vHue;

      void main() {
        vec3 p = position * uSize;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float audioHue = uAudioLevel * 360.0;
        float finalHue = uAudioReactive
          ? mod(uHueShift + audioHue + aBaseHue + aPhase * 30.0, 360.0)
          : mod(uHueShift + aBaseHue, 360.0);
        vHue = finalHue;
      }
    `,o=`
      precision mediump float;
      uniform float uOpacity;
      uniform float uBrightnessBoost;
      varying float vHue;

      vec3 hsl2rgb(float h, float s, float l) {
        float c = (1.0 - abs(2.0*l - 1.0)) * s;
        float hp = h * 6.0;
        float x = c * (1.0 - abs(mod(hp, 2.0) - 1.0));
        vec3 rgb;
        if      (0.0 <= hp && hp < 1.0) rgb = vec3(c, x, 0.0);
        else if (1.0 <= hp && hp < 2.0) rgb = vec3(x, c, 0.0);
        else if (2.0 <= hp && hp < 3.0) rgb = vec3(0.0, c, x);
        else if (3.0 <= hp && hp < 4.0) rgb = vec3(0.0, x, c);
        else if (4.0 <= hp && hp < 5.0) rgb = vec3(x, 0.0, c);
        else                            rgb = vec3(c, 0.0, x);
        float m = l - 0.5 * c;
        return rgb + vec3(m);
      }

      void main() {
        float h = vHue / 360.0;
        float brightness = 0.5 * uBrightnessBoost;
        vec3 color = hsl2rgb(h, 1.0, brightness);
        gl_FragColor = vec4(color, uOpacity);
      }
    `;this.material=new fn({uniforms:this.uniforms,vertexShader:s,fragmentShader:o,transparent:!0,depthWrite:!1,blending:ji}),this.mesh=new Gd(i,this.material,this.count),this.mesh.instanceMatrix.setUsage(of),this.mesh.layers.disable(Fi),e.add(this.mesh);const a=new Float32Array(this.count),r=new Float32Array(this.count);for(let c=0;c<this.count;c++){a[c]=Math.random()*360,r[c]=Math.random(),this.angles[c]=Math.random()*Math.PI*2,this.radii[c]=2+Math.random()*5;const u=c*3;this.velocities[u]=(Math.random()-.5)*.002,this.velocities[u+1]=(Math.random()-.5)*.002,this.velocities[u+2]=(Math.random()-.5)*.002}this.geometry=i,this.geometry.setAttribute("aBaseHue",new pa(a,1)),this.geometry.setAttribute("aPhase",new pa(r,1)),this.particleBaseHues=a,this._tmpMatrix=new gt,this._tmpQuat=new zs,this._tmpScale=new U(1,1,1),this._tmpPos=new U,this.maxSegments=this.count*this.maxTrailLength*2,this.trailSegmentArray=new Float32Array(this.maxSegments*3),this.trailColorArray=new Float32Array(this.maxSegments*3),this.trailGeometry=new Xt,this.trailGeometry.setAttribute("position",new en(this.trailSegmentArray,3)),this.trailGeometry.setAttribute("color",new en(this.trailColorArray,3)),this.trailGeometry.setDrawRange(0,0),this.trailMaterial=new jd({vertexColors:!0,transparent:!0,opacity:this.trailOpacity}),this.trailLines=new Fx(this.trailGeometry,this.trailMaterial),this.trailLines.visible=!1,this.trailLines.layers.disable(Fi),e.add(this.trailLines),this._initParticles(),this.setLayout("orbit"),console.log(`✨ Particle drift initialized for ${this.count} particles`)}_initParticles(){for(let e=0;e<this.count;e++){const t=Math.cos(this.angles[e])*this.radii[e],i=Math.sin(this.angles[e])*this.radii[e],s=0,o=e*3;this.targets[o]=t,this.targets[o+1]=i,this.targets[o+2]=s,this._tmpPos.set(t,i,s),this._tmpMatrix.compose(this._tmpPos,this._tmpQuat,this._tmpScale),this.mesh.setMatrixAt(e,this._tmpMatrix)}this.mesh.instanceMatrix.needsUpdate=!0}setLayout(e){this.currentLayout=e}updateLayoutVesselPlanes(){for(let t=0;t<this.count;t++){const i=t*3,s=t%6,o=t/this.count*Math.PI*2;switch(s){case 0:this.targets[i]=2,this.targets[i+1]=Math.cos(o)*2,this.targets[i+2]=Math.sin(o)*2;break;case 1:this.targets[i]=-2,this.targets[i+1]=Math.cos(o)*2,this.targets[i+2]=Math.sin(o)*2;break;case 2:this.targets[i]=Math.cos(o)*2,this.targets[i+1]=2,this.targets[i+2]=Math.sin(o)*2;break;case 3:this.targets[i]=Math.cos(o)*2,this.targets[i+1]=-2,this.targets[i+2]=Math.sin(o)*2;break;case 4:this.targets[i]=Math.cos(o)*2,this.targets[i+1]=Math.sin(o)*2,this.targets[i+2]=2;break;case 5:this.targets[i]=Math.cos(o)*2,this.targets[i+1]=Math.sin(o)*2,this.targets[i+2]=-2;break}const a=this.organicStrength*.1;this.targets[i]+=(Math.random()-.5)*a,this.targets[i+1]+=(Math.random()-.5)*a,this.targets[i+2]+=(Math.random()-.5)*a}}update(){const e=Date.now()*.001,t=this.smoothness,i=Ki(),s=this.audioReactive?(i.bass+i.mid+i.treble)/3*this.audioGain:0;for(let a=0;a<this.count;a++){const r=a*3;switch(this.currentLayout){case"orbit":{this.angles[a]+=this.orbitalSpeed*.01;const p=this.organicStrength*.05*Math.sin(e*.3+a*.17),_=this.organicStrength*Math.sin(e*.5+a*.23);this.targets[r]=Math.cos(this.angles[a]+p)*(this.radii[a]+_),this.targets[r+1]=Math.sin(this.angles[a]+p)*(this.radii[a]+_),this.targets[r+2]=_*.5;break}case"sphere":{const p=a%180*Math.PI/180,_=a%360*Math.PI/180,v=2.5+this.organicStrength*Math.sin(e*.8+a*.19),b=this.organicStrength*.05*Math.cos(e*.2+a*.31);this.targets[r]=v*Math.sin(p)*Math.cos(_+b),this.targets[r+1]=v*Math.sin(p)*Math.sin(_+b),this.targets[r+2]=v*Math.cos(p);break}case"torus":{const p=a%360*Math.PI/180,_=a%360*Math.PI/180,v=2.5+this.organicStrength*Math.sin(e*.5+a*.11),b=1+this.organicStrength*Math.cos(e*.7+a*.17),P=this.organicStrength*.05*Math.sin(e*.4+a*.29);this.targets[r]=(v+b*Math.cos(_))*Math.cos(p+P),this.targets[r+1]=(v+b*Math.cos(_))*Math.sin(p+P),this.targets[r+2]=b*Math.sin(_);break}case"cube":{const _=Math.sin(e*.1+a*.37)*5,v=Math.cos(e*.15+a*.41)*5,b=Math.sin(e*.12+a*.43)*5,P=this.organicStrength*Math.sin(e*.6+a*.23),C=this.organicStrength*Math.cos(e*.7+a*.29),A=this.organicStrength*Math.sin(e*.5+a*.31);this.targets[r]=_+P,this.targets[r+1]=v+C,this.targets[r+2]=b+A;break}case"vesselPlanes":{this.updateLayoutVesselPlanes();break}}this.mesh.getMatrixAt(a,this._tmpMatrix),this._tmpMatrix.decompose(this._tmpPos,this._tmpQuat,this._tmpScale);let c=this.targets[r],u=this.targets[r+1],l=this.targets[r+2];if(this.organicStrength>0&&this.driftOffsets.length){const p=this.driftOffsets[a],_=.18*p.s,v=.23*p.s,b=.15*p.s,P=this.organicStrength*.018,C=Math.sin(e*_+p.x)*p.ax,A=Math.cos(e*v+p.y)*p.ay,F=Math.sin(e*b+p.z)*p.az,w=Math.sin(e*_*2.3+p.x*1.7)*p.a2,S=Math.sin(e*v*2.1+p.y*1.3)*p.a2,R=Math.cos(e*b*2.4+p.z*1.9)*p.a2;c+=(C+.4*w)*P,u+=(A+.4*S)*P,l+=(F+.4*R)*P,this._driftNotified||(this._driftNotified=!0,console.log(`✨ Particle drift per-axis active (organic=${this.organicStrength.toFixed(2)})`))}const h=a*3,f=(d==null?void 0:d.particleMotionStrength)??.5;c+=this.velocities[h]*f,u+=this.velocities[h+1]*f,l+=this.velocities[h+2]*f;const m=f*.01;if(c+=Math.sin(e*.3+a*.17)*m,u+=Math.cos(e*.4+a*.23)*m,l+=Math.sin(e*.35+a*.29)*m,((d==null?void 0:d.useAudioJitter)??!0)&&this.audioReactive&&s>.1){const p=s*.01,_=a*.37%(Math.PI*2),v=Math.cos(_)*p,b=Math.sin(_)*p,P=Math.sin(_*.7)*p;c+=v,u+=b,l+=P}if(this.currentLayout==="vesselPlanes"&&this.vesselGroup){const p=new U(c,u,l);p.applyQuaternion(this.vesselGroup.quaternion),c=p.x,u=p.y,l=p.z}const y=10,g=c*c+u*u+l*l;if(g>y*y){const p=Math.sqrt(g),_=y/p;c*=_,u*=_,l*=_}this._tmpPos.set(this._tmpPos.x+(c-this._tmpPos.x)*t,this._tmpPos.y+(u-this._tmpPos.y)*t,this._tmpPos.z+(l-this._tmpPos.z)*t),this._tmpMatrix.compose(this._tmpPos,this._tmpQuat,this._tmpScale),this.mesh.setMatrixAt(a,this._tmpMatrix)}if(this.mesh.instanceMatrix.needsUpdate=!0,this.trailEnabled&&this.trailAudioReactive){const a=Math.floor(ho.lerp(this.trailLengthMin,this.trailLengthMax,this.audioLevel));this.trailLength=Math.max(0,Math.min(this.maxTrailLength,a))}if(!this.trailEnabled||this.trailLength<=0||this.count===0)this.trailHistory=[],this.trailLines.visible=!1,this.trailGeometry.setDrawRange(0,0);else{const a=new Float32Array(this.count*3);for(let h=0;h<this.count;h++){this.mesh.getMatrixAt(h,this._tmpMatrix),this._tmpMatrix.decompose(this._tmpPos,this._tmpQuat,this._tmpScale);const f=h*3;a[f]=this._tmpPos.x,a[f+1]=this._tmpPos.y,a[f+2]=this._tmpPos.z}this.trailHistory.unshift(a),this.trailHistory.length>this.trailLength&&this.trailHistory.pop();let r=0,c=0;const u=new tt;for(let h=0;h<this.count;h++){const f=h*3,m=this.particleBaseHues[h];let x=this.hueShift;if(this.audioReactive){const y=s*360;x=(this.hueShift+y+m)%360}else x=(this.hueShift+m)%360;u.setHSL(x/360,1,.5);for(let y=0;y<this.trailHistory.length-1;y++){const g=this.trailHistory[y],p=this.trailHistory[y+1];this.trailSegmentArray[r++]=g[f],this.trailSegmentArray[r++]=g[f+1],this.trailSegmentArray[r++]=g[f+2],this.trailSegmentArray[r++]=p[f],this.trailSegmentArray[r++]=p[f+1],this.trailSegmentArray[r++]=p[f+2];const _=1-y/this.trailHistory.length*this.trailFade;this.trailColorArray[c++]=u.r*_,this.trailColorArray[c++]=u.g*_,this.trailColorArray[c++]=u.b*_,this.trailColorArray[c++]=u.r*_,this.trailColorArray[c++]=u.g*_,this.trailColorArray[c++]=u.b*_}}const l=r/3;l>0?(this.trailGeometry.setDrawRange(0,l),this.trailGeometry.attributes.position.needsUpdate=!0,this.trailGeometry.attributes.color.needsUpdate=!0,this.trailLines.visible=!0):(this.trailGeometry.setDrawRange(0,0),this.trailLines.visible=!1),this.trailMaterial.opacity=this.trailOpacity}let o=1;if(this.sizeWorld<.3&&(o=ho.lerp(1.6,1,this.sizeWorld/.3)),this.uniforms.uSize.value=this.sizeWorld,this.uniforms.uOpacity.value=this.opacity,this.uniforms.uHueShift.value=this.hueShift,this.uniforms.uAudioReactive.value=this.audioReactive,this.uniforms.uAudioLevel.value=s,this.uniforms.uBrightnessBoost.value=o,Math.random()<.01){const a=s*360;(this.hueShift+a)%360;const r=this.currentLayout==="vesselPlanes"&&this.vesselGroup?" (coupled)":"";this.audioReactive;const c=this.trailAudioReactive?"audioReactiveLen=true":"",u=this.trailEnabled?` | trails: enabled length=${this.trailLength} opacity=${this.trailOpacity.toFixed(2)} fade=${this.trailFade.toFixed(2)} ${c} perf=OK`:"",l=this.organicStrength>0?` ✨ Particle drift active (organic=${this.organicStrength.toFixed(2)})`:"";console.log(`✨ Layout: ${this.currentLayout}${r} | count: ${this.count} | size: ${this.sizeWorld.toFixed(2)} | speed: ${this.orbitalSpeed.toFixed(2)} | organic: ${this.organicStrength.toFixed(2)}${l}${u}`)}}setOrbitalSpeed(e){this.orbitalSpeed=Math.max(.01,e)}setSmoothness(e){this.smoothness=e}setOpacity(e){this.opacity=e}setOrganicStrength(e){this.organicStrength=e}setHueShift(e){this.hueShift=e%360}setAudioReactive(e){this.audioReactive=!!e}setVesselReference(e){this.vesselGroup=e}setTrailEnabled(e){this.trailEnabled=!!e}setTrailLength(e){this.trailLength=Math.max(0,Math.min(this.maxTrailLength,Math.floor(e)))}setTrailOpacity(e){this.trailOpacity=Math.max(0,Math.min(1,e))}setTrailFade(e){this.trailFade=Math.max(0,Math.min(1,e))}setTrailAudioReactive(e){this.trailAudioReactive=!!e}setTrailLengthMin(e){this.trailLengthMin=Math.max(1,Math.min(this.maxTrailLength,Math.floor(e)))}setTrailLengthMax(e){this.trailLengthMax=Math.max(1,Math.min(this.maxTrailLength,Math.floor(e)))}setProjectParticlesToShadow(e){e?(this.mesh.layers.enable(Fi),this.trailLines.layers.enable(Fi)):(this.mesh.layers.disable(Fi),this.trailLines.layers.disable(Fi))}setAudioLevel(e){this.audioLevel=e}setAudioGain(e){this.audioGain=e}setParticleSizeWorld(e){this.sizeWorld=Math.max(.05,e)}setParticleSize(e){this.sizeWorld=Math.max(.05,e)}changeLayout(e){this.setLayout(e)}setParticleCount(e){this.dispose(this.scene);const t=new Aa(this.scene,e);return t.setParticleSizeWorld(this.sizeWorld),t.setAudioGain(this.audioGain),t.setHueShift(this.hueShift),t.setAudioReactive(this.audioReactive),t.setOrbitalSpeed(this.orbitalSpeed),t.setSmoothness(this.smoothness),t.setOpacity(this.opacity),t.setOrganicStrength(this.organicStrength),t.setLayout(this.currentLayout),t}dispose(e){e.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose()}}let ti=null;function mo(n,e=5e3){return ti&&va(n),ti=new Aa(n,e),ti}function du(n,e){ti&&ti.update()}function va(n){ti&&(ti.dispose(n),ti=null)}function Ay(){return ti}const ea={pizza:["🍕","🌶️","🍄","🧄","🧀"],cosmos:["⭐","🌙","☀️","🌍","🌌"],myth:["🦁","🦅","🐍","🐉","🔥"],ocean:["🌊","🐠","🐙","🦈","🐚"],nature:["🌲","🍃","🌺","🦋","🌈"],tech:["💻","🤖","⚡","🔮","💎"]};class Rr{constructor(e,t=50,i="🍕"){var o,a;this.scene=e,this.count=t,this.emoji=i,this.layout="cube",this.audioReactivity=1,this.useInstancing=!0,this.linkedToSignals=!1,this.currentSet=null,this.currentSetIndex=0,this.autoCycleEnabled=!1,this.cycleInterval=4e3,this.lastCycleTime=performance.now(),this.storyMode=!1,this.storySequence=["pizza","cosmos","myth"],this.storyIndex=0,this.bpm=120,this.beatSyncEnabled=!1,this.lastBeatTime=performance.now(),this.beatInterval=0,this.subdivision=4,this.sequencerEnabled=!1,this.sequence=["🍕","🌶️","🍄","🧄"],this.sequenceIndex=0,this.pulseAmount=0,this.pulseDuration=200,this.lastPulseTime=0,this.onsetDetection=!1,this.lastOnsetValue=0,this.orbitSpeed=.01,this.spiralRotation=0,this.gridSpacing=1,this.orbitRings=3,this.orbitRadii=[],this.positions=[],this.velocities=[],this.baseScales=[],this.rotations=[],this.basePositions=[],this.physicsMode="none",this.accelerations=[],this.vesselCenter=new U(0,0,0),this.mousePosition=new U(0,0,0),this.clusters=[],this.particleToCluster=new Map,this.nextClusterId=0;let s;(o=d.mandala)!=null&&o.useCustomImage&&((a=d.mandala)!=null&&a.customImage)?s=new ya().load(d.mandala.customImage,()=>console.log(`🖼️ Initial mandala texture: ${d.mandala.customImageName||"custom image"}`),void 0,c=>{console.error("🖼️ Failed to load custom image, using emoji fallback:",c)}):s=this.createEmojiTexture(this.emoji,128);try{const r=new bi(1,1),c=new Yi({map:s,transparent:!0,opacity:.8,side:hn});this.instancedMesh=new Gd(r,c,t),this.dummy=new Lt;for(let u=0;u<t;u++){const l=.4+Math.random()*.4;this.baseScales.push(l);const h=new U((Math.random()-.5)*.01,(Math.random()-.5)*.01,(Math.random()-.5)*.01);this.velocities.push(h),this.positions.push(new U(0,0,0)),this.rotations.push(0),this.accelerations.push(new U(0,0,0))}this.scene.add(this.instancedMesh),this.positionSprites(),console.log(`🍕 EmojiParticles (instanced) initialized: ${t} x ${i}`)}catch(r){console.warn("🍕 Instancing failed, using fallback sprite mode:",r),this.useInstancing=!1,this.initSpriteFallback(s)}this.setupMandalaImageListeners()}setupMandalaImageListeners(){window.addEventListener("mandala:imageSelected",()=>{this.swapEmoji(this.emoji)}),window.addEventListener("mandala:imageCleared",()=>{this.swapEmoji(this.emoji)})}initSpriteFallback(e){this.sprites=[];for(let t=0;t<this.count;t++){const i=new kr({map:e,transparent:!0,opacity:.8}),s=new Hd(i);s.userData.baseScale=this.baseScales[t],this.scene.add(s),this.sprites.push(s)}this.positionSprites(),console.log(`🍕 EmojiParticles (fallback sprites) initialized: ${this.count} x ${this.emoji}`)}createEmojiTexture(e,t){const i=document.createElement("canvas");i.width=t,i.height=t;const s=i.getContext("2d");s.font=`${t*.8}px serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(e,t/2,t/2);const o=new Ot(i);return o.needsUpdate=!0,o}update(e=0){var c,u,l,h;const t=e??((c=d==null?void 0:d.audio)==null?void 0:c.level)??0,i=this.audioReactivity;if(this.autoCycleEnabled&&this.currentSet){const f=performance.now();f-this.lastCycleTime>=this.cycleInterval&&(this.cycleEmoji(),this.lastCycleTime=f)}const s=((u=d==null?void 0:d.audio)==null?void 0:u.bass)??0,o=((l=d==null?void 0:d.audio)==null?void 0:l.mid)??0,a=((h=d==null?void 0:d.audio)==null?void 0:h.treble)??0,r=performance.now();if(this.beatSyncEnabled&&this.bpm>0){const f=6e4/this.bpm/(this.subdivision/4);this.beatInterval=f,r-this.lastBeatTime>=f&&(this.triggerBeat(),this.lastBeatTime=r)}if(this.onsetDetection){const f=s+o+a;f>.5&&f>this.lastOnsetValue*1.5&&(this.triggerBeat(),console.log("🥁 Beat detected → pulse")),this.lastOnsetValue=f}if(this.pulseAmount>0){const f=(r-this.lastPulseTime)/this.pulseDuration;this.pulseAmount=Math.max(0,1-f)}if(this.linkedToSignals&&(d!=null&&d.morphWeights)){const f=d.morphWeights,m=(f.cube||0)+(f.sphere||0)+(f.pyramid||0)+(f.torus||0);m>0&&((f.cube||0)/m,(f.sphere||0)/m,(f.pyramid||0)/m,(f.torus||0)/m)}if(this.applyPhysics(t,s,o,a),this.applyCollisions(),this.applyFusion(t),this.applyConstellation(),this.applyMandala(),this.useInstancing&&this.instancedMesh){for(let m=0;m<this.count;m++){const x=this.positions[m],y=this.velocities[m],g=this.baseScales[m];if(x.add(y),this.layout==="orbit"||this.layout==="ring"){this.orbitSpeed*(1+t*i);const b=this.orbitRadii[m]||6,C=m/this.count*Math.PI*2+this.spiralRotation;x.x=b*Math.cos(C),x.z=b*Math.sin(C)}if(this.layout==="spiral"){const b=m*.3+this.spiralRotation,P=5+m*.02;x.x=Math.cos(b)*P,x.z=Math.sin(b)*P,x.y=m*.1}if(this.linkedToSignals&&s>.1){const b=x.clone().normalize();x.add(b.multiplyScalar(s*.05*i))}const p=10;Math.abs(x.x)>p&&(y.x*=-1,x.x=Math.sign(x.x)*p),Math.abs(x.y)>p&&(y.y*=-1,x.y=Math.sign(x.y)*p),Math.abs(x.z)>p&&(y.z*=-1,x.z=Math.sign(x.z)*p);let _=g+t*1.5*i;if(this.pulseAmount>0&&(_+=this.pulseAmount*.3),this.particleToCluster.has(m)){const b=this.particleToCluster.get(m),P=this.clusters.find(C=>C.id===b);P&&(_=P.scale)}const v=this.linkedToSignals?o*.1:0;this.rotations[m]+=(t*.05+v)*i,this.dummy.position.copy(x),this.dummy.scale.set(_,_,_),this.dummy.rotation.z=this.rotations[m],this.dummy.updateMatrix(),this.instancedMesh.setMatrixAt(m,this.dummy.matrix)}let f=.8;this.linkedToSignals&&a>.2&&(f=.7+a*.3),this.pulseAmount>0&&(f=Math.min(1,f+this.pulseAmount*.2)),this.instancedMesh.material.opacity=f,this.instancedMesh.instanceMatrix.needsUpdate=!0,(this.layout==="spiral"||this.layout==="orbit"||this.layout==="ring")&&(this.spiralRotation+=this.orbitSpeed*(1+t*.5))}else this.sprites&&this.sprites.forEach((f,m)=>{const y=(f.userData.baseScale||.5)+t*1.5*i;f.scale.set(y,y,y),f.material.rotation+=t*.05*i,f.material.opacity=.7+t*.3*i;const g=this.velocities[m];f.position.add(g);const p=10;Math.abs(f.position.x)>p&&(g.x*=-1,f.position.x=Math.sign(f.position.x)*p),Math.abs(f.position.y)>p&&(g.y*=-1,f.position.y=Math.sign(f.position.y)*p),Math.abs(f.position.z)>p&&(g.z*=-1,f.position.z=Math.sign(f.position.z)*p)})}setPhysicsMode(e){this.physicsMode=e,console.log(`🌐 Emoji physics: ${e}`)}applyPhysics(e,t,i,s){var l,h,f,m;if(this.physicsMode==="none")return;const{physicsMode:o}=d.emojiPhysics||{},a=((l=d.emojiPhysics)==null?void 0:l.gravityStrength)??.01,r=((h=d.emojiPhysics)==null?void 0:h.orbitStrength)??.005,c=((f=d.emojiPhysics)==null?void 0:f.repulsionStrength)??.02,u=((m=d.emojiPhysics)==null?void 0:m.audioModulation)??!0;for(let x=0;x<this.count;x++){const y=this.positions[x],g=this.velocities[x],p=this.accelerations[x];if(p.set(0,0,0),this.physicsMode==="gravity"){const _=u?a*(1+t*2):a;p.y-=_}else if(this.physicsMode==="orbit"){const _=new U().subVectors(this.vesselCenter,y);if(_.length()>.1){_.normalize();const b=u?r*(1+i*.5):r;p.add(_.multiplyScalar(b))}}else if(this.physicsMode==="repulsion"){const _=new U().subVectors(y,this.vesselCenter);if(_.length()>.1){_.normalize();const b=u?c*(1+s*3):c;p.add(_.multiplyScalar(b))}}g.add(p),g.multiplyScalar(.98)}}applyCollisions(){var t;if(!((t=d.emojiPhysics)!=null&&t.collisionEnabled))return;const e=.5;for(let i=0;i<this.count;i++)for(let s=i+1;s<this.count;s++){const o=this.positions[i],a=this.positions[s],r=this.velocities[i],c=this.velocities[s],u=new U().subVectors(o,a),l=u.length();if(l<e*2&&l>0){const h=e*2-l,f=u.normalize();o.add(f.clone().multiplyScalar(h*.5)),a.sub(f.clone().multiplyScalar(h*.5));const x=new U().subVectors(r,c).dot(f);if(x<0){const g=f.multiplyScalar(x*.3);r.sub(g),c.add(g)}}}}applySwirlForce(e,t){var o;if(!((o=d.emojiPhysics)!=null&&o.mouseInteraction))return;this.mousePosition.set(e/window.innerWidth*20-10,-(t/window.innerHeight)*20+10,0);const i=.05,s=5;for(let a=0;a<this.count;a++){const r=this.positions[a],c=this.velocities[a],u=new U().subVectors(this.mousePosition,r),l=u.length();if(l<s&&l>.1){const h=new U(-u.y,u.x,0).normalize(),f=1-l/s;c.add(h.multiplyScalar(i*f))}}}applyFusion(e=0){var s,o;if(!((s=d.emojiFusion)!=null&&s.enabled))return;const t=((o=d.emojiFusion)==null?void 0:o.threshold)??1,i=new Set;for(let a=0;a<this.count;a++)if(!this.particleToCluster.has(a))for(let r=a+1;r<this.count;r++){if(this.particleToCluster.has(r))continue;const c=this.positions[a],u=this.positions[r];if(c.distanceTo(u)<t){const h=this.nextClusterId++,f=new U().addVectors(c,u).multiplyScalar(.5),m={id:h,particleIndices:[a,r],position:f,scale:this.baseScales[a]+this.baseScales[r],opacity:.9,driftVelocity:new U((this.velocities[a].x+this.velocities[r].x)*.5,(this.velocities[a].y+this.velocities[r].y)*.5,(this.velocities[a].z+this.velocities[r].z)*.5),createdAt:performance.now()};this.clusters.push(m),this.particleToCluster.set(a,h),this.particleToCluster.set(r,h),i.add(h),console.log(`⚡ ${this.emoji} + ${this.emoji} fused → cluster #${h}`)}}this.updateClusters(e),this.checkClusterDecay(t)}updateClusters(e=0){var i,s;performance.now(),(i=d==null?void 0:d.audio)==null||i.bass;const t=((s=d==null?void 0:d.audio)==null?void 0:s.mid)??0;for(const o of this.clusters){const a=1+e*.5;o.scale*=a,o.opacity=.85+t*.15,e<.1&&o.driftVelocity.multiplyScalar(1-.001),o.position.add(o.driftVelocity);for(const r of o.particleIndices)this.positions[r].copy(o.position)}}checkClusterDecay(e){var i;const t=[];for(let s=0;s<this.clusters.length;s++){const o=this.clusters[s];if(performance.now()-o.createdAt>5e3&&(((i=d==null?void 0:d.audio)==null?void 0:i.level)??0)<.1){for(const r of o.particleIndices)this.particleToCluster.delete(r),this.velocities[r].set((Math.random()-.5)*.01,(Math.random()-.5)*.01,(Math.random()-.5)*.01);t.push(s),console.log(`💥 Cluster #${o.id} decayed → particles restored`)}}for(let s=t.length-1;s>=0;s--)this.clusters.splice(t[s],1)}generateConstellationPositions(){const{type:e,scale:t,customPattern:i}=d.emojiConstellations||{},s=[];switch(e){case"Line":for(let c=0;c<this.count;c++){const u=c/(this.count-1)-.5;s.push(new U(u*t*2,0,0))}break;case"Triangle":for(let c=0;c<this.count;c++){const u=c/this.count*Math.PI*2,l=c%3;l===0?s.push(new U(Math.cos(u)*t,Math.sin(u)*t,0)):l===1?s.push(new U(Math.cos(u+Math.PI*2/3)*t,Math.sin(u+Math.PI*2/3)*t,0)):s.push(new U(Math.cos(u+Math.PI*4/3)*t,Math.sin(u+Math.PI*4/3)*t,0))}break;case"Star":for(let c=0;c<this.count;c++){const u=c/this.count*Math.PI*2,h=c%2===0?t:t*.4;s.push(new U(Math.cos(u-Math.PI/2)*h,Math.sin(u-Math.PI/2)*h,0))}break;case"Spiral":for(let c=0;c<this.count;c++){const u=c*.5,l=t*Math.sqrt(c/this.count);s.push(new U(Math.cos(u)*l,Math.sin(u)*l,c*.05))}break;case"CircleOf5ths":const o=[0,7,2,9,4,11,6,1,8,3,10,5];for(let c=0;c<this.count;c++){const u=c%12,h=o[u]/12*Math.PI*2-Math.PI/2,f=Math.floor(c/12),m=t*(1+f*.3);s.push(new U(Math.cos(h)*m,Math.sin(h)*m,f*.2))}break;case"Platonic":const a=(1+Math.sqrt(5))/2,r=[[0,1,a],[0,-1,a],[0,1,-a],[0,-1,-a],[1,a,0],[-1,a,0],[1,-a,0],[-1,-a,0],[a,0,1],[-a,0,1],[a,0,-1],[-a,0,-1]];for(let c=0;c<this.count;c++){const u=r[c%r.length],l=t/2;s.push(new U(u[0]*l,u[1]*l,u[2]*l))}break;case"Custom":if(i&&i.positions)for(let c=0;c<this.count;c++){const u=i.positions[c%i.positions.length];s.push(new U(u.x*t,u.y*t,(u.z||0)*t))}break;default:return null}return s}applyConstellation(){var u,l;const{type:e,rotation:t,audioSync:i,beatSync:s}=d.emojiConstellations||{};if(e==="None")return;const o=this.generateConstellationPositions();if(!o)return;const a=((u=d==null?void 0:d.audio)==null?void 0:u.level)??0,r=t+(i?a*.5:0);for(let h=0;h<this.count;h++)if(h<o.length){const f=o[h],m=f.x*Math.cos(r)-f.z*Math.sin(r),x=f.x*Math.sin(r)+f.z*Math.cos(r);if(this.positions[h].set(m,f.y,x),s&&this.pulseAmount>0){const y=1+this.pulseAmount*.2;this.positions[h].multiplyScalar(y)}}const c=((l=d.emojiConstellations)==null?void 0:l.rotationSpeed)??.01;d.emojiConstellations.rotation+=c}generateMandalaPositions(){const{enabled:e,rings:t,symmetry:i,ringRadii:s,musicalMode:o,scale:a,rootNote:r,layoutMode:c}=d.emojiMandala||{};if(!e)return null;const u=[],l=[],h=[];let f=0;const m=o?Zc[a]||Zc.Major:null,x=c||"radial",y=Math.PI/6;for(let g=0;g<t&&g<6;g++){const p=s[g]||g*2;let _=g===0?1:i;o&&m&&g>0&&(_=m.length);for(let v=0;v<_&&!(f>=this.count);v++){if(g===0)u.push(new U(0,0,0)),h.push(r);else{let b,P,C=0,A,F=r;if(o&&m){const w=m[v%m.length];A=Ty.indexOf(w)/12*Math.PI*2-Math.PI/2,F=r+w+Math.floor(g/2)*12}else A=v/_*Math.PI*2;if(x==="spiral")A+=g*y,b=Math.cos(A)*p,P=Math.sin(A)*p;else if(x==="grid"){const w=Math.ceil(Math.sqrt(_)),S=Math.floor(v/w),R=v%w,N=p*2/w;b=(R-w/2)*N+N/2,P=(S-w/2)*N+N/2+g*2}else b=Math.cos(A)*p,P=Math.sin(A)*p;u.push(new U(b,P,C)),h.push(F)}l.push(g),f++}}for(;f<this.count;)u.push(new U(0,0,0)),l.push(t-1),h.push(r),f++;return{positions:u,particleRingAssignment:l,particleNoteAssignment:h}}applyMandala(){var k,G,X,Y;const{enabled:e,rotation:t,rotationSpeed:i,audioModulation:s,layeredAudio:o,musicalMode:a,activeNotes:r,notePulse:c,differentialRotation:u,ringRotationSpeeds:l,scaleSequenceEnabled:h,scaleSequence:f,scaleSequenceIndex:m,scaleSequenceInterval:x,lastScaleChange:y,mandalaAudioReactive:g,radiusPulse:p,anglePulse:_}=d.emojiMandala||{};if(!e)return;if(h&&f&&f.length>0){const J=performance.now();if(J-y>=x){const V=(m+1)%f.length;d.emojiMandala.scaleSequenceIndex=V,d.emojiMandala.scale=f[V],d.emojiMandala.lastScaleChange=J,console.log(`🎛️ Scale sequence → ${f[V]}`)}}const v=this.generateMandalaPositions();if(!v)return;const{positions:b,particleRingAssignment:P,particleNoteAssignment:C}=v,A=((k=d==null?void 0:d.audio)==null?void 0:k.level)??0,F=((G=d==null?void 0:d.audio)==null?void 0:G.bass)??0,w=((X=d==null?void 0:d.audio)==null?void 0:X.mid)??0,S=((Y=d==null?void 0:d.audio)==null?void 0:Y.treble)??0;for(let J=0;J<this.count;J++)if(J<b.length){const V=b[J],ae=P[J];let ce;if(u&&l){const re=l[ae]||.01,O=s?ae===0?F*.2:ae<=2?w*.3:S*.5:0,fe=re*(1+O);this.ringRotations||(this.ringRotations=Array(6).fill(0)),this.ringRotations[ae]+=fe,ce=this.ringRotations[ae]}else ce=t+(s?A*.3:0);g&&_&&(ce+=_);const ue=g?1+(p||0):1,Fe=V.x*Math.cos(ce)-V.y*Math.sin(ce),He=V.x*Math.sin(ce)+V.y*Math.cos(ce);let q=1;if(o?ae===0?q=1+F*.3:ae<=1?q=1+F*.2:ae<=3?q=1+w*.25:q=1+S*.3:q=1+A*.2,a&&C[J]!==void 0){const re=C[J],O=c[re]||0;q+=O*.5,this.particleNoteMap||(this.particleNoteMap={}),this.particleNoteMap[J]=re}const te=q*ue;this.positions[J].set(Fe*te,He*te,V.z),this.particleRingIndex||(this.particleRingIndex=[]),this.particleRingIndex[J]=ae}const R=i??.02,N=s?R*(1+A*2):R;d.emojiMandala.rotation+=N}positionSprites(){const e=(t,i)=>{if(this.useInstancing&&this.instancedMesh){this.positions[t].copy(i);const s=this.baseScales[t];this.dummy.position.copy(i),this.dummy.scale.set(s,s,s),this.dummy.rotation.z=this.rotations[t],this.dummy.updateMatrix(),this.instancedMesh.setMatrixAt(t,this.dummy.matrix)}else this.sprites&&this.sprites[t]&&this.sprites[t].position.copy(i)};for(let t=0;t<this.count;t++){const i=new U;if(this.layout==="cube")i.set((Math.random()-.5)*10,(Math.random()-.5)*10,(Math.random()-.5)*10);else if(this.layout==="sphere"){const o=Math.acos(2*Math.random()-1),a=2*Math.PI*Math.random();i.set(5*Math.sin(o)*Math.cos(a),5*Math.sin(o)*Math.sin(a),5*Math.cos(o))}else if(this.layout==="ring"||this.layout==="orbit"){const o=4+t%this.orbitRings*2;this.orbitRadii[t]=o;const a=t/this.count*Math.PI*2;i.set(o*Math.cos(a),0,o*Math.sin(a))}else if(this.layout==="random")i.set((Math.random()-.5)*20,(Math.random()-.5)*20,(Math.random()-.5)*20);else if(this.layout==="spiral"){const s=t*.3,o=5+t*.02;i.set(Math.cos(s)*o,t*.1,Math.sin(s)*o)}else if(this.layout==="wave"){const s=Math.ceil(Math.sqrt(this.count)),o=t%s*this.gridSpacing-s*this.gridSpacing/2,a=Math.floor(t/s)*this.gridSpacing-s*this.gridSpacing/2;i.set(o,Math.sin((o+a)*.5)*2,a)}else if(this.layout==="burst"){const s=Math.random()*2,o=Math.acos(2*Math.random()-1),a=2*Math.PI*Math.random();i.set(s*Math.sin(o)*Math.cos(a),s*Math.sin(o)*Math.sin(a),s*Math.cos(o));const r=this.velocities[t],c=i.clone().normalize();r.copy(c.multiplyScalar(.02))}e(t,i)}this.useInstancing&&this.instancedMesh&&(this.instancedMesh.instanceMatrix.needsUpdate=!0)}setLayout(e){this.layout=e,this.positionSprites(),console.log(`🍕 Emoji layout set to: ${e}`)}setAudioReactivity(e){this.audioReactivity=e,console.log(`🍕 Emoji audio reactivity = ${e.toFixed(1)}x`)}setSignalLinking(e){this.linkedToSignals=e,console.log(e?"🍕 EmojiParticles linked to morph/audio":"🍕 EmojiParticles unlinked from signals")}loadEmojiSet(e){if(!ea[e]){console.warn(`🍕 Unknown emoji set: ${e}`);return}this.currentSet=e,this.currentSetIndex=0,this.emoji=ea[e][0],this.swapEmoji(this.emoji),console.log(`🍕 Emoji set loaded: ${e}`)}cycleEmoji(){if(!this.currentSet||!ea[this.currentSet]){console.warn("🍕 No emoji set active for cycling");return}const e=ea[this.currentSet];this.currentSetIndex=(this.currentSetIndex+1)%e.length,this.emoji=e[this.currentSetIndex],this.swapEmoji(this.emoji),console.log(`🍕 Emoji cycled: ${this.emoji}`)}setAutoCycle(e,t=4e3){this.autoCycleEnabled=e,this.cycleInterval=t,this.lastCycleTime=performance.now(),console.log(e?`🍕 Emoji auto-cycle enabled (${t}ms interval)`:"🍕 Emoji auto-cycle disabled")}setBPM(e){this.bpm=e,console.log(`🥁 Emoji sync at ${e} BPM`)}setBeatSync(e){this.beatSyncEnabled=e,this.lastBeatTime=performance.now(),console.log(e?`🥁 Beat sync enabled at ${this.bpm} BPM`:"🥁 Beat sync disabled")}setSubdivision(e){this.subdivision=e,console.log(`🥁 Emoji subdivision = ${{4:"1/4",8:"1/8",16:"1/16"}[e]||e} notes`)}setOnsetDetection(e){this.onsetDetection=e,console.log(e?"🥁 Onset detection enabled":"🥁 Onset detection disabled")}setSequencer(e,t=["🍕","🌶️","🍄","🧄"]){this.sequencerEnabled=e,this.sequence=t,this.sequenceIndex=0,console.log(e?`🥁 Sequencer ON: ${t.join(" → ")}`:"🥁 Sequencer OFF")}triggerBeat(){this.pulseAmount=1,this.lastPulseTime=performance.now(),this.sequencerEnabled&&this.sequence.length>0&&(this.emoji=this.sequence[this.sequenceIndex],this.swapEmoji(this.emoji),console.log(`🥁 Step ${this.sequenceIndex+1}/${this.sequence.length} → ${this.emoji}`),this.sequenceIndex=(this.sequenceIndex+1)%this.sequence.length)}setStoryMode(e,t=["pizza","cosmos","myth"]){this.storyMode=e,this.storySequence=t,this.storyIndex=0,e?(this.loadEmojiSet(t[0]),console.log(`📖 Story mode enabled: ${t.join(" → ")}`)):console.log("📖 Story mode disabled")}advanceStory(){if(!this.storyMode||this.storySequence.length===0){console.warn("📖 Story mode not active");return}this.storyIndex=(this.storyIndex+1)%this.storySequence.length;const e=this.storySequence[this.storyIndex];this.loadEmojiSet(e),console.log(`📖 Story advanced → ${e} set`)}swapEmoji(e){var s,o,a,r,c;this.emoji=e;let t;(s=d.mandala)!=null&&s.useCustomImage&&((o=d.mandala)!=null&&o.customImage)?t=new ya().load(d.mandala.customImage,()=>{console.log(`🖼️ Custom mandala image loaded: ${d.mandala.customImageName||"uploaded image"}`),this.useInstancing&&this.instancedMesh?this.instancedMesh.material.needsUpdate=!0:this.sprites&&this.sprites.forEach(l=>l.material.needsUpdate=!0)},void 0,l=>{console.error("🖼️ Failed to load custom mandala image, falling back to emoji:",l);const h=this.createEmojiTexture(e,128);this.applyTexture(h)}):t=this.createEmojiTexture(e,128),this.applyTexture(t);const i=(a=d.mandala)!=null&&a.useCustomImage&&((r=d.mandala)!=null&&r.customImage)?"custom image":"emoji";console.log(`🍕 Texture updated: ${i} ${i==="emoji"?e:"("+(((c=d.mandala)==null?void 0:c.customImageName)||"uploaded")+")"}`)}applyTexture(e){this.useInstancing&&this.instancedMesh?(this.instancedMesh.material.map&&this.instancedMesh.material.map.dispose(),this.instancedMesh.material.map=e,this.instancedMesh.material.needsUpdate=!0):this.sprites&&this.sprites.forEach(t=>{t.material.map&&t.material.map.dispose(),t.material.map=e,t.material.needsUpdate=!0})}dispose(){this.useInstancing&&this.instancedMesh?(this.scene.remove(this.instancedMesh),this.instancedMesh.geometry.dispose(),this.instancedMesh.material.dispose(),this.instancedMesh.material.map&&this.instancedMesh.material.map.dispose(),this.instancedMesh=null,console.log("🍕 EmojiParticles (instanced) disposed")):this.sprites&&(this.sprites.forEach(e=>{this.scene.remove(e),e.material.dispose(),e.material.map&&e.material.map.dispose()}),this.sprites=[],console.log("🍕 EmojiParticles disposed")),this.positions=[],this.velocities=[],this.baseScales=[],this.rotations=[]}}class uu{constructor(e){this.scene=e,this.streams=new Map,console.log("🎨 EmojiStreamManager initialized")}addStream(e,t=100,i=!0){if(this.streams.has(e)){console.warn(`🎨 Stream already exists: ${e}`);return}const s=new Rr(this.scene,t,e);s.enabled=i,i||s.instancedMesh&&this.scene.remove(s.instancedMesh),this.streams.set(e,s),console.log(`${e} Stream added: ${t}`)}removeStream(e){const t=this.streams.get(e);if(!t){console.warn(`🎨 Stream not found: ${e}`);return}t.dispose(),this.streams.delete(e),console.log(`${e} Stream disposed`)}toggleStream(e,t){const i=this.streams.get(e);if(!i){console.warn(`🎨 Stream not found: ${e}`);return}i.enabled=t,t?(i.instancedMesh&&!this.scene.children.includes(i.instancedMesh)&&this.scene.add(i.instancedMesh),console.log(`${e} Stream enabled`)):(i.instancedMesh&&this.scene.remove(i.instancedMesh),console.log(`${e} Stream disabled`))}updateStreamCount(e,t){const i=this.streams.get(e);if(!i){console.warn(`🎨 Stream not found: ${e}`);return}const s=i.enabled,o=i.layout,a=i.audioReactivity;i.dispose();const r=new Rr(this.scene,t,e);r.enabled=s,r.setLayout(o),r.setAudioReactivity(a),!s&&r.instancedMesh&&this.scene.remove(r.instancedMesh),this.streams.set(e,r),console.log(`${e} Count updated: ${t}`)}update(e){this.streams.forEach((t,i)=>{t.enabled&&t.update(e)})}setPhysicsMode(e){this.streams.forEach((t,i)=>{t.setPhysicsMode(e)})}getStreamsArray(){const e=[];return this.streams.forEach((t,i)=>{e.push({emoji:i,count:t.count,enabled:t.enabled})}),e}loadStreams(e){this.streams.forEach((t,i)=>{t.dispose()}),this.streams.clear(),e.forEach(({emoji:t,count:i,enabled:s})=>{this.addStream(t,i,s)}),console.log(`🎨 Loaded ${e.length} emoji streams`)}dispose(){this.streams.forEach((e,t)=>{e.dispose()}),this.streams.clear(),console.log("🎨 EmojiStreamManager disposed")}}class hu{constructor(e){this.streamManager=e,this.enabled=!1,this.bpm=120,this.currentBeat=0,this.patterns={},this.timelineLength=16,this.lastBeatTime=performance.now(),this.beatInterval=6e4/this.bpm,console.log("🎶 EmojiSequencer initialized")}setBPM(e){this.bpm=e,this.beatInterval=6e4/this.bpm,console.log(`🎶 Sequencer BPM set to ${e}`)}setTimelineLength(e){this.timelineLength=e,Object.keys(this.patterns).forEach(t=>{const i=this.patterns[t];i.length<e?this.patterns[t]=[...i,...new Array(e-i.length).fill(0)]:i.length>e&&(this.patterns[t]=i.slice(0,e))}),console.log(`🎶 Timeline length set to ${e} beats`)}setPattern(e,t){if(!Array.isArray(t)){console.warn(`🎶 Invalid pattern for ${e}`);return}if(t.length!==this.timelineLength){const i=new Array(this.timelineLength).fill(0);for(let s=0;s<Math.min(t.length,this.timelineLength);s++)i[s]=t[s];this.patterns[e]=i}else this.patterns[e]=[...t];console.log(`🎶 Pattern set for ${e}: ${this.patterns[e].join("")}`)}toggleBeat(e,t){return this.patterns[e]||(this.patterns[e]=new Array(this.timelineLength).fill(0)),this.patterns[e][t]=this.patterns[e][t]?0:1,console.log(`🎶 ${e} beat ${t}: ${this.patterns[e][t]?"ON":"OFF"}`),this.patterns[e][t]}getPattern(e){return this.patterns[e]||(this.patterns[e]=new Array(this.timelineLength).fill(0)),this.patterns[e]}setEnabled(e){this.enabled=e,e?(this.currentBeat=0,this.lastBeatTime=performance.now(),console.log(`🎶 Sequencer ON @ ${this.bpm} BPM`)):console.log("🎶 Sequencer OFF")}reset(){this.currentBeat=0,this.lastBeatTime=performance.now(),console.log("🎶 Sequencer reset to beat 0")}update(){if(!this.enabled)return;const e=performance.now();e-this.lastBeatTime>=this.beatInterval&&(this.advanceBeat(),this.lastBeatTime=e)}advanceBeat(){this.currentBeat=(this.currentBeat+1)%this.timelineLength,Object.keys(this.patterns).forEach(e=>{const t=this.patterns[e][this.currentBeat],i=this.streamManager.streams.get(e);if(i){const s=i.enabled,o=t===1;s!==o&&(this.streamManager.toggleStream(e,o),o&&console.log(`🎶 ${e} active on beat ${this.currentBeat+1}`))}})}loadFromState(e){this.bpm=e.bpm||120,this.timelineLength=e.timelineLength||16,this.patterns={},Object.keys(e.patterns||{}).forEach(t=>{this.patterns[t]=[...e.patterns[t]]}),this.beatInterval=6e4/this.bpm,console.log(`🎶 Sequencer loaded: ${this.bpm} BPM, ${this.timelineLength} beats`)}saveToState(){return{enabled:this.enabled,bpm:this.bpm,currentBeat:this.currentBeat,patterns:JSON.parse(JSON.stringify(this.patterns)),timelineLength:this.timelineLength}}}class fu{constructor(e,t){this.streamManager=e,this.sequencer=t,this.banks=new Array(8).fill(null),this.currentBankIndex=null,console.log("💾 EmojiPatternBankManager initialized (8 banks)")}saveBank(e,t=null){if(e<0||e>=8)return console.warn(`💾 Invalid bank index: ${e}`),!1;const i=this.streamManager.getStreamsArray(),s=this.sequencer.saveToState(),o={name:t||`Bank ${e+1}`,streams:JSON.parse(JSON.stringify(i)),patterns:JSON.parse(JSON.stringify(s.patterns)),bpm:s.bpm,timelineLength:s.timelineLength,timestamp:new Date().toISOString()};this.banks[e]=o;const a=i.map(r=>r.emoji).join("");return console.log(`💾 Bank ${e+1} saved → ${a}`),!0}loadBank(e){if(e<0||e>=8)return console.warn(`📂 Invalid bank index: ${e}`),!1;const t=this.banks[e];if(!t)return console.warn(`📂 Bank ${e+1} is empty`),!1;this.streamManager&&this.streamManager.loadStreams(t.streams),this.sequencer&&this.sequencer.loadFromState({bpm:t.bpm,patterns:t.patterns,timelineLength:t.timelineLength,enabled:this.sequencer.enabled}),this.currentBankIndex=e;const i=t.streams.map(s=>s.emoji).join("");return console.log(`📂 Bank ${e+1} loaded → ${i}`),!0}clearBank(e){return e<0||e>=8?(console.warn(`💾 Invalid bank index: ${e}`),!1):(this.banks[e]=null,console.log(`💾 Bank ${e+1} cleared`),!0)}getBank(e){return e<0||e>=8?null:this.banks[e]}isBankEmpty(e){return e<0||e>=8?!0:this.banks[e]===null}getBankName(e){const t=this.getBank(e);return t?t.name:`Bank ${e+1}`}renameBank(e,t){if(e<0||e>=8)return!1;const i=this.banks[e];return i?(i.name=t,console.log(`💾 Bank ${e+1} renamed to "${t}"`),!0):!1}loadBanksFromState(e){if(!Array.isArray(e)||e.length!==8){console.warn("💾 Invalid banks array, resetting to empty"),this.banks=new Array(8).fill(null);return}this.banks=e.map(i=>i?{name:i.name||"Unnamed",streams:i.streams||[],patterns:i.patterns||{},bpm:i.bpm||120,timelineLength:i.timelineLength||16,timestamp:i.timestamp||new Date().toISOString()}:null);const t=this.banks.filter(i=>i!==null).length;console.log(`💾 Loaded ${t} pattern banks`)}saveBanksToState(){return this.banks.map(e=>e?{name:e.name,streams:JSON.parse(JSON.stringify(e.streams)),patterns:JSON.parse(JSON.stringify(e.patterns)),bpm:e.bpm,timelineLength:e.timelineLength,timestamp:e.timestamp}:null)}}const Mt=Object.freeze(Object.defineProperty({__proto__:null,EmojiParticles:Rr,EmojiPatternBankManager:fu,EmojiSequencer:hu,EmojiStreamManager:uu,ParticleSystem:Aa,destroyParticles:va,getParticleSystemInstance:Ay,initParticles:mo,updateParticles:du},Symbol.toStringTag,{value:"Module"}));console.log("🧠 AUDIO DEBUG PROBE ACTIVE — Phase 13.1a");const _n=(...n)=>console.log("audio.js:",...n);_n("🎶 audio.js loaded (Phase 13.1)");function Ry(n){const e=Math.max(0,Math.min(4,window.ReactivityGain??(window.ReactivityGain=1)));return e===1?n:{bass:Math.min(1,((n==null?void 0:n.bass)??0)*e),mid:Math.min(1,((n==null?void 0:n.mid)??0)*e),treble:Math.min(1,((n==null?void 0:n.treble)??0)*e),level:Math.min(1,((n==null?void 0:n.level)??0)*e)}}class Py{constructor(){this.ctx=null,this.source=null,this.analyser=null,this.inputGain=null,this.stream=null,this.deviceId=null,this.state="idle",this.fftSize=2048,this.smoothing=.8,this.freqData=null,this.timeData=null,this.onReadyCbs=new Set,this.onErrorCbs=new Set,this.frameListeners=new Set,this.bands={bass:0,mid:0,treble:0,level:0},this.frameLoop=null,this._boundResume=this._resumeIfSuspended.bind(this),this._visibility=this._handleVisibility.bind(this),document.addEventListener("visibilitychange",this._visibility),window.addEventListener("focus",this._boundResume)}async toggleTestTone(e=!this.testToneActive){var t;if(await this._ensureContext(),e&&!this.testToneOsc){console.log("📢 AudioEngine: Test Tone ON @ 220 Hz (to analyser)");const i=this.ctx.createOscillator(),s=this.ctx.createGain();i.type="sine",i.frequency.value=220,s.gain.value=.25;try{(t=this.source)==null||t.disconnect(this.inputGain)}catch{}i.connect(s).connect(this.inputGain),i.start(),this.testToneOsc=i,this.testToneGain=s,this.testToneActive=!0;return}if(!e&&this.testToneOsc){console.log("🔇 AudioEngine: Test Tone OFF");try{this.testToneOsc.stop(),this.testToneOsc.disconnect(),this.testToneGain.disconnect()}catch{}if(this.testToneOsc=null,this.testToneGain=null,this.testToneActive=!1,this.source&&this.inputGain)try{this.source.connect(this.inputGain)}catch{}}}async listInputs(){var t;return(t=navigator.mediaDevices)!=null&&t.enumerateDevices?(await navigator.mediaDevices.enumerateDevices()).filter(i=>i.kind==="audioinput"):[]}async selectDevice(e){this.deviceId=e||null,await this._ensureInput(!0),console.log("🎛️ AudioEngine: switched input",this.deviceId||"(default)")}setPreGain(e){this.preGain&&(this.preGain.gain.value=Math.max(.1,Math.min(16,e)),console.log("🔉 AudioEngine preGain =",this.preGain.gain.value.toFixed(2),"x"))}async init(e={}){if(this.state==="idle"){this.fftSize=e.fftSize||this.fftSize,this.smoothing=e.smoothing??this.smoothing,this.deviceId=e.deviceId||null;try{await this._ensureContext(),await this._ensureInput(),this._ensureAnalyser(),this.state="ready",_n("✅ Audio engine ready"),this._notify(this.onReadyCbs)}catch(t){this.state="error",console.error("audio.js: ❌ init failed:",t),this._notify(this.onErrorCbs,t)}}}async start(){return console.log("🔍 Phase 13.1a: AudioEngine.start() called, state=",this.state),this.state==="idle"&&await this.init(),this.state==="error"?!1:(await this._resumeIfSuspended(),this.state="running",this.frameLoop||this._startFrameLoop(),console.log("🔍 Phase 13.1a: AudioEngine.start() complete, state=",this.state),!0)}on(e,t){e==="frame"&&typeof t=="function"&&this.frameListeners.add(t)}off(e,t){e==="frame"&&this.frameListeners.delete(t)}emit(e,t){if(e==="frame")for(const i of this.frameListeners)try{i(t)}catch(s){console.error("AudioEngine frame listener error:",s)}}_startFrameLoop(){let e=0;const t=()=>{if(this.state!=="running"){this.frameLoop=null,_n("🛑 Frame loop stopped, state:",this.state);return}this.updateBands(),this.emit("frame",Ry(this.bands)),e++%120===0&&_n(`🎧 Frame loop tick #${e}, listeners: ${this.frameListeners.size}, bands:`,this.bands),this.frameLoop=requestAnimationFrame(t)};this.frameLoop=requestAnimationFrame(t),_n("🎧 AudioEngine frame loop started, listeners:",this.frameListeners.size)}updateBands(){if(!this.analyser)return;const e=this.getSpectrum(),t=this.getRMS(),i=e.length;if(i>0){const s=Math.floor(i*.15),o=Math.floor(i*.6),a=(r,c,u)=>r.slice(c,u).reduce((l,h)=>l+h,0)/(u-c);this.bands={bass:a(e,0,s)/255,mid:a(e,s,o)/255,treble:a(e,o,i)/255,level:t},!this._printedNonZero&&this.bands.level>.02&&(this._printedNonZero=!0,console.log("✅ Mic bands active:",this.bands))}}async stop(){try{if(this.stream)for(const e of this.stream.getTracks())e.stop()}catch{}this.stream=null,this.source=null,this.state="ready"}async setDeviceId(e){e!==this.deviceId&&(this.deviceId=e||null,this.ctx||await this._ensureContext(),await this._ensureInput(!0),this._ensureAnalyser(),_n("🔁 Switched audio device:",this.deviceId||"(default)"))}onReady(e){return this.onReadyCbs.add(e),()=>this.onReadyCbs.delete(e)}onError(e){return this.onErrorCbs.add(e),()=>this.onErrorCbs.delete(e)}getAnalyser(){return this.analyser}getRMS(){if(!this.analyser)return 0;this.timeData||(this.timeData=new Uint8Array(this.analyser.fftSize)),this.analyser.getByteTimeDomainData(this.timeData);let e=0;for(let t=0;t<this.timeData.length;t++){const i=(this.timeData[t]-128)/128;e+=i*i}return Math.sqrt(e/this.timeData.length)}getSpectrum(){return this.analyser?(this.freqData||(this.freqData=new Uint8Array(this.analyser.frequencyBinCount)),this.analyser.getByteFrequencyData(this.freqData),this.freqData):new Uint8Array(0)}tick(){}async _ensureContext(){if(this.ctx)return;const e=window.AudioContext||window.webkitAudioContext;if(!e)throw new Error("WebAudio not supported");this.ctx=new e({latencyHint:"interactive"}),_n("🧠 AudioContext created:",this.ctx.state)}async _ensureInput(e=!1){var t,i,s;if(await this._ensureContext(),this.inputGain||(this.inputGain=this.ctx.createGain()),this.preGain||(this.preGain=this.ctx.createGain()),(typeof this.preGain.gain.value!="number"||this.preGain.gain.value===0)&&(this.preGain.gain.value=4),e||!this.stream){try{(t=this.source)==null||t.disconnect()}catch{}try{(s=(i=this.stream)==null?void 0:i.getTracks)==null||s.call(i).forEach(a=>a.stop())}catch{}const o=this.deviceId?{audio:{deviceId:{exact:this.deviceId}}}:{audio:!0};this.stream=await navigator.mediaDevices.getUserMedia(o),this.source=this.ctx.createMediaStreamSource(this.stream)}this._ensureAnalyser();try{this.source.disconnect()}catch{}try{this.preGain.disconnect()}catch{}try{this.inputGain.disconnect()}catch{}this.source.connect(this.preGain),this.preGain.connect(this.inputGain),this.inputGain.connect(this.analyser),this.state="ready",console.log("🎙️ Mic path wired → analyser (preGain:",this.preGain.gain.value.toFixed(2)+")")}_ensureAnalyser(){var e,t,i,s;if(!(!this.ctx||!this.source)){this.inputGain||(this.inputGain=this.ctx.createGain()),this.inputGain.gain.value=1,this.analyser||(this.analyser=this.ctx.createAnalyser()),this.analyser.fftSize=this.fftSize,this.analyser.smoothingTimeConstant=this.smoothing;try{this.source.disconnect()}catch{}(t=(e=this.inputGain).disconnect)==null||t.call(e),(s=(i=this.analyser).disconnect)==null||s.call(i),this.source.connect(this.inputGain),this.inputGain.connect(this.analyser)}}async _resumeIfSuspended(){if(this.ctx&&this.ctx.state==="suspended")try{await this.ctx.resume(),_n("▶️ AudioContext resumed")}catch(e){console.warn("AudioContext resume failed:",e)}}_handleVisibility(){document.visibilityState==="visible"&&this._resumeIfSuspended()}_notify(e,t){for(const i of e)try{i(t)}catch(s){console.error(s)}}}const st=new Py;typeof window<"u"&&(window.AudioEngine=st,window.AudioProbe={start:()=>st.start(),stop:()=>st.stop(),info:()=>{var n;return{ctx:(n=st.ctx)==null?void 0:n.state,hasAnalyser:!!st.analyser,state:st.state,frameListeners:st.frameListeners.size,bands:st.bands}},getBands:()=>st.bands,getRMS:()=>st.getRMS(),getSpectrum:()=>st.getSpectrum(),testEvent:()=>{const n=e=>{console.log("🧪 AudioProbe test listener:",e)};return st.on("frame",n),console.log("✅ Test listener registered. Check console for frame events."),()=>{st.off("frame",n),console.log("🧹 Test listener removed")}}},window.AudioEngineProbe=window.AudioProbe);try{window!=null&&window.hudCallbacks&&typeof window.hudCallbacks=="object"&&(window.hudCallbacks.audio=()=>st.tick(),_n("🔗 Registered hudCallbacks.audio"))}catch{}function pu(){_n("initAudio() called (legacy API - no-op in Phase 13.1)")}function Ly(){return _n("enableAudio() called (legacy API - delegating to AudioEngine.start())"),console.log("🔍 Phase 13.1a: enableAudio() → AudioEngine.start()"),st.start()}function mu(){st.tick()}const Iy=Object.freeze(Object.defineProperty({__proto__:null,AudioEngine:st,enableAudio:Ly,initAudio:pu,updateAudio:mu},Symbol.toStringTag,{value:"Module"}));console.log("🚢 vessel.js loaded");let Rt,Wi,Bi=null;const Qc=["lattice","hoops","shells"];function Dy(){return[{axis:[0,0,1],angle:0},{axis:[0,0,1],angle:Math.PI/4},{axis:[0,0,1],angle:Math.PI/2},{axis:[0,0,1],angle:3*Math.PI/4},{axis:[1,0,0],angle:Math.PI/4},{axis:[1,0,0],angle:-Math.PI/4},{axis:[0,1,0],angle:Math.PI/4},{axis:[0,1,0],angle:-Math.PI/4},{axis:[1,0,0],angle:3*Math.PI/4},{axis:[1,0,0],angle:-(3*Math.PI)/4},{axis:[0,1,0],angle:3*Math.PI/4},{axis:[0,1,0],angle:-(3*Math.PI)/4}]}function Uy(){const n=[];for(let e=0;e<6;e++){const t=(e-2.5)*.4;n.push({axis:[0,0,1],angle:0,position:[0,t,0],scale:1-Math.abs(t)*.1})}return n}function Fy(){const n=[];return[.8,1,1.2].forEach(t=>{for(let i=0;i<4;i++)n.push({axis:[0,0,1],angle:i*Math.PI/2,radius:t})}),n}function Ny(){return[{dir:[1,0,0],label:"East",color:16711680},{dir:[-1,0,0],label:"West",color:65280},{dir:[0,1,0],label:"Up",color:255},{dir:[0,-1,0],label:"Down",color:16776960},{dir:[0,0,1],label:"North",color:65535},{dir:[0,0,-1],label:"South",color:16711935}]}function ed(n){switch(n){case"hoops":return Uy();case"shells":return Fy();case"conflat6":return Ny();case"lattice":default:return Dy()}}let Oy=class{constructor(e,t,i){const o=new bi(6,6),a=new Yi({map:null,transparent:!0,opacity:.9});this.plane=new Pt(o,a),this.plane.position.set(0,-5,0),this.plane.rotation.x=-Math.PI/2,e.add(this.plane),this.scene=e,this.renderTarget=new wn(1024,1024),this.plane.material.map=this.renderTarget.texture,this.renderer=t,this.camera=i,this.shadowCam=new wa(-3,3,3,-3,.1,20),this.shadowCam.position.set(0,5,0),this.shadowCam.lookAt(0,0,0)}render(){if(!Rt||!this.renderer)return;const e=this.renderer.getRenderTarget();this.renderer.setRenderTarget(this.renderTarget),this.renderer.clear(),this.renderer.render(Rt,this.shadowCam),this.renderer.setRenderTarget(e)}dispose(){this.plane&&(this.scene.remove(this.plane),this.plane.geometry.dispose(),this.plane.material.dispose()),this.renderTarget&&this.renderTarget.dispose()}};function Jr(n,e,t){console.log("🚢 Initializing vessel system..."),Rt=new ws,(d.vessel.mode||"gyre")==="conflat6"?(ed("conflat6").forEach(o=>{const{dir:a,label:r,color:c}=o,u=new xa(1.5,.05,16,64),l=new Yn({color:c,transparent:!0,opacity:d.vessel.opacity||.7,emissive:c,emissiveIntensity:.3}),h=new Pt(u,l);new U(...a),Math.abs(a[1])>.9?h.rotation.x=0:Math.abs(a[0])>.9?h.rotation.y=Math.PI/2:h.rotation.x=Math.PI/2,Rt.add(h),console.log(`🧭 ${r} ring (${c.toString(16)}) added`)}),Rt.rotation.set(Math.PI/6,Math.PI/6,0),!Bi&&e&&t&&(Bi=new Oy(n,e,t)),console.log("✅ Vessel initialized - Conflat 6 (directional compass rings)")):(Wi=new Yn({color:d.vessel.color,transparent:!0,opacity:d.vessel.opacity}),ed(d.vessel.layout).forEach(o=>{const{axis:a,angle:r,position:c,scale:u,radius:l}=o,h=new xa(l||1,.03,24,100),f=new Pt(h,Wi);f.rotateOnAxis(new U(...a),r),c&&f.position.set(...c),u&&f.scale.setScalar(u),Rt.add(f)}),Bi&&(Bi.dispose(),Bi=null),console.log(`✅ Vessel initialized - Gyre mode (${d.vessel.layout} layout)`)),Rt.scale.setScalar(d.vessel.scale),Rt.visible=d.vessel.enabled,Rt.layers.enable(Fi),n.add(Rt)}function gu(){Bi&&d.vessel.mode==="conflat6"&&d.vessel.enabled&&Bi.render()}function xu(){if(!Rt||!pt||(Rt.visible=d.vessel.enabled&&d.vessel.visible,!Rt.visible))return;d.vessel.spinEnabled&&(Rt.rotation.y+=d.vessel.spinSpeed),pt.geometry.computeBoundingSphere();let e=pt.geometry.boundingSphere.radius*(d.vessel.scaleMultiplier||1.2)*d.vessel.scale;Rt.scale.set(e,e,e),Wi.opacity=d.vessel.opacity;const t=d.colorLayers.vessel,i=Ki(),s=(i.bass+i.mid+i.treble)/3;let o=t.baseColor;if(d.audioReactive){const r=1+(i.bass-.5)*.1;Rt.scale.multiplyScalar(r),Wi.opacity=ho.clamp(.2+i.mid*.6,.2,.8),o=Ca(t.baseColor,t.audioColor,t.audioIntensity,s),Math.random()<.02&&console.log(`🎨 Vessel: base=${t.baseColor} audio=${t.audioColor} final=${o}`)}Wi.color.set(o);const a=document.getElementById("vessel-debug");a&&(a.textContent=`Radius: ${e.toFixed(2)}`)}function By(n){d.vessel.layoutIndex=(d.vessel.layoutIndex+1)%Qc.length,d.vessel.layout=Qc[d.vessel.layoutIndex],console.log(`🔄 Vessel layout cycled to: ${d.vessel.layout}`),yu(n),ky()}function yu(n,e,t){Rt&&(n.remove(Rt),Rt.clear()),Jr(n,e,t),Wi&&Wi.color.set(d.vessel.color)}function ky(){const n=document.getElementById("vessel-layout-dropdown");n&&(n.value=d.vessel.layout,console.log(`🔄 HUD synced to layout: ${d.vessel.layout}`))}console.log("🚢 Vessel module ready");const _a=Object.freeze(Object.defineProperty({__proto__:null,cycleLayout:By,initVessel:Jr,reinitVessel:yu,renderShadowProjection:gu,updateVessel:xu},Symbol.toStringTag,{value:"Module"})),zy={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class yo{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Vy=new wa(-1,1,1,-1,0,1);class Hy extends Xt{constructor(){super(),this.setAttribute("position",new mt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new mt([0,2,0,0,2,0],2))}}const Gy=new Hy;class Pr{constructor(e){this._mesh=new Pt(Gy,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Vy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class jy extends yo{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof fn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Nr.clone(e.uniforms),this.material=new fn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Pr(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class td extends yo{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const s=e.getContext(),o=e.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0);let a,r;this.inverse?(a=0,r=1):(a=1,r=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),o.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),o.buffers.stencil.setClear(r),o.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(s.EQUAL,1,4294967295),o.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),o.buffers.stencil.setLocked(!0)}}class Wy extends yo{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class $y{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Ke);this._width=i.width,this._height=i.height,t=new wn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:qi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new jy(zy),this.copyPass.material.blending=Qn,this.clock=new Gx}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let s=0,o=this.passes.length;s<o;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const r=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(r.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(r.EQUAL,1,4294967295)}this.swapBuffers()}td!==void 0&&(a instanceof td?i=!0:a instanceof Wy&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ke);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let o=0;o<this.passes.length;o++)this.passes[o].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class qy extends yo{constructor(e,t,i=null,s=null,o=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=o,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new tt}render(e,t,i){const s=e.autoClear;e.autoClear=!1;let o,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(o=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(o),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Xy={name:"AfterimageShader",uniforms:{damp:{value:.96},tOld:{value:null},tNew:{value:null}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float damp;

		uniform sampler2D tOld;
		uniform sampler2D tNew;

		varying vec2 vUv;

		vec4 when_gt( vec4 x, float y ) {

			return max( sign( x - y ), 0.0 );

		}

		void main() {

			vec4 texelOld = texture2D( tOld, vUv );
			vec4 texelNew = texture2D( tNew, vUv );

			texelOld *= damp * when_gt( texelOld, 0.1 );

			gl_FragColor = max(texelNew, texelOld);

		}`};class Yy extends yo{constructor(e=.96){super(),this.shader=Xy,this.uniforms=Nr.clone(this.shader.uniforms),this.uniforms.damp.value=e,this.textureComp=new wn(window.innerWidth,window.innerHeight,{magFilter:Ht,type:qi}),this.textureOld=new wn(window.innerWidth,window.innerHeight,{magFilter:Ht,type:qi}),this.compFsMaterial=new fn({uniforms:this.uniforms,vertexShader:this.shader.vertexShader,fragmentShader:this.shader.fragmentShader}),this.compFsQuad=new Pr(this.compFsMaterial),this.copyFsMaterial=new Yi,this.copyFsQuad=new Pr(this.copyFsMaterial)}render(e,t,i){this.uniforms.tOld.value=this.textureOld.texture,this.uniforms.tNew.value=i.texture,e.setRenderTarget(this.textureComp),this.compFsQuad.render(e),this.copyFsQuad.material.map=this.textureComp.texture,this.renderToScreen?(e.setRenderTarget(null),this.copyFsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this.copyFsQuad.render(e));const s=this.textureOld;this.textureOld=this.textureComp,this.textureComp=s}setSize(e,t){this.textureComp.setSize(e,t),this.textureOld.setSize(e,t)}dispose(){this.textureComp.dispose(),this.textureOld.dispose(),this.compFsMaterial.dispose(),this.copyFsMaterial.dispose(),this.compFsQuad.dispose(),this.copyFsQuad.dispose()}}console.log("🎞️ postprocessing.js loaded");function Ky(n,e,t){const i=new $y(n),s=new qy(e,t);i.addPass(s);const o=new Yy;return o.uniforms.damp.value=.96,i.addPass(o),console.log("🎞️ EffectComposer initialized with AfterimagePass (damp: 0.96)"),{composer:i,afterimagePass:o}}console.log("💾 presets.js loaded");const vu="morphing_interface_presets";let Jy=[];function _u(){console.log("💾 Presets system initialized")}function $i(n,e,t="Uncategorized",i=[]){var r,c,u,l,h,f,m,x,y,g,p,_,v,b,P,C,A,F,w,S,R,N,k,G,X,Y,J,V,ae,ce,ue,Fe,He,q,te,re,O,fe;if(!n||typeof n!="string")return console.warn("💾 Invalid preset name:",n),!1;const s=js();if(!d.colorLayers)return console.warn("⚠️ savePreset(): colorLayers missing in global state"),!1;const o=Me=>{var Ie,L,Ge,Ce,Ne,ge,Xe,ve,be,je,T,M,j;return Me==="geometry"?{baseColor:((L=(Ie=d.colorLayers)==null?void 0:Ie.geometry)==null?void 0:L.baseColor)??"#ffffff",audioColor:((Ce=(Ge=d.colorLayers)==null?void 0:Ge.geometry)==null?void 0:Ce.audioColor)??"#000000",audioIntensity:((ge=(Ne=d.colorLayers)==null?void 0:Ne.geometry)==null?void 0:ge.audioIntensity)??1}:{baseColor:((ve=(Xe=d.colorLayers)==null?void 0:Xe[Me])==null?void 0:ve.baseColor)??"#ffffff",audioColor:((je=(be=d.colorLayers)==null?void 0:be[Me])==null?void 0:je.audioColor)??"#000000",audioIntensity:((M=(T=d.colorLayers)==null?void 0:T[Me])==null?void 0:M.audioIntensity)??1,opacity:((j=d==null?void 0:d[Me])==null?void 0:j.opacity)??1}},a={name:n,timestamp:new Date().toISOString(),category:t||"Uncategorized",tags:Array.isArray(i)?i:[],visualSettings:{...d.lighting},morphWeights:{...d.morphWeights},color:d.color,idleSpin:d.idleSpin,scale:d.scale,colorLayers:{geometry:o("geometry"),vessel:o("vessel"),shadows:o("shadows"),particles:o("particles")},vessel:{opacity:((r=d.vessel)==null?void 0:r.opacity)??.5,scale:((c=d.vessel)==null?void 0:c.scale)??1,color:((u=d.vessel)==null?void 0:u.color)??"#00ff00",enabled:((l=d.vessel)==null?void 0:l.enabled)??!0,spinEnabled:((h=d.vessel)==null?void 0:h.spinEnabled)??!1,spinSpeed:((f=d.vessel)==null?void 0:f.spinSpeed)??.0035,layout:((m=d.vessel)==null?void 0:m.layout)??"lattice",layoutIndex:((x=d.vessel)==null?void 0:x.layoutIndex)??0,audioSmoothing:((y=d.vessel)==null?void 0:y.audioSmoothing)??.7,hueShiftRange:((g=d.vessel)==null?void 0:g.hueShiftRange)??20},shadows:{enabled:((p=d.shadows)==null?void 0:p.enabled)??!0,ground:((_=d.shadows)==null?void 0:_.ground)??!0,backdrop:((v=d.shadows)==null?void 0:v.backdrop)??!0,opacity:((b=d.shadows)==null?void 0:b.opacity)??.25,color:((P=d.shadows)==null?void 0:P.color)??"#000000"},sprites:{enabled:((C=d.sprites)==null?void 0:C.enabled)??!0,count:((A=d.sprites)==null?void 0:A.count)??200},particles:{enabled:((F=d.particles)==null?void 0:F.enabled)??!0,count:((w=d.particles)==null?void 0:w.count)??5e3,layout:((S=d.particles)==null?void 0:S.layout)??"cube",hue:((R=d.particles)==null?void 0:R.hue)??0,size:((N=d.particles)==null?void 0:N.size)??.02,opacity:((k=d.particles)==null?void 0:k.opacity)??.5,organicMotion:((G=d.particles)==null?void 0:G.organicMotion)??!1,organicStrength:((X=d.particles)==null?void 0:X.organicStrength)??.2,audioReactiveHue:((Y=d.particles)==null?void 0:Y.audioReactiveHue)??!1,velocity:((J=d.particles)==null?void 0:J.velocity)??.05,orbitalSpeed:((V=d.particles)==null?void 0:V.orbitalSpeed)??.05,motionSmoothness:((ae=d.particles)==null?void 0:ae.motionSmoothness)??.5,spread:((ce=d.particlesMotion)==null?void 0:ce.spread)??1,minCount:((ue=d.particles)==null?void 0:ue.minCount)??1e3,maxCount:((Fe=d.particles)==null?void 0:Fe.maxCount)??1e4,minSize:((He=d.particles)==null?void 0:He.minSize)??.005,maxSize:((q=d.particles)==null?void 0:q.maxSize)??.1},emojiStreams:d.emojiStreams??[],emojiSequencer:{enabled:((te=d.emojiSequencer)==null?void 0:te.enabled)??!1,bpm:((re=d.emojiSequencer)==null?void 0:re.bpm)??120,patterns:((O=d.emojiSequencer)==null?void 0:O.patterns)??{},timelineLength:((fe=d.emojiSequencer)==null?void 0:fe.timelineLength)??16},emojiBanks:d.emojiBanks??[null,null,null,null,null,null,null,null],currentBank:d.currentBank??null};return s[n]=a,Mu(s),console.log(`💾 Preset saved: ${n}`),Qr({action:"saved",presetName:n}),!0}function Zr(n){var i,s,o;if(!n||typeof n!="string")return console.warn("💾 Invalid preset name:",n),null;const t=js()[n];if(!t)return console.warn(`💾 Preset not found: ${n}`),null;if(t.visualSettings&&Object.assign(d.lighting,t.visualSettings),t.morphWeights&&Object.assign(d.morphWeights,t.morphWeights),t.color&&(d.color=t.color),t.idleSpin!==void 0&&(d.idleSpin=t.idleSpin),t.scale!==void 0&&(d.scale=t.scale),t.vessel){if(t.vessel.opacity!==void 0&&(d.vessel.opacity=t.vessel.opacity),t.vessel.scale!==void 0&&(d.vessel.scale=t.vessel.scale),t.vessel.color!==void 0&&(d.vessel.color=t.vessel.color),t.vessel.enabled!==void 0&&(d.vessel.enabled=t.vessel.enabled),t.vessel.spinEnabled!==void 0&&(d.vessel.spinEnabled=t.vessel.spinEnabled),t.vessel.spinSpeed!==void 0&&(d.vessel.spinSpeed=t.vessel.spinSpeed),t.vessel.layout!==void 0){d.vessel.layout=t.vessel.layout;const a=["lattice","hoops","shells"];d.vessel.layoutIndex=t.vessel.layoutIndex!==void 0?t.vessel.layoutIndex:a.indexOf(t.vessel.layout),Pe(async()=>{const{reinitVessel:r}=await Promise.resolve().then(()=>_a);return{reinitVessel:r}},void 0,import.meta.url).then(({reinitVessel:r})=>{Pe(async()=>{const{scene:c}=await Promise.resolve().then(()=>Gi);return{scene:c}},void 0,import.meta.url).then(({scene:c})=>{r(c)})})}t.vessel.audioSmoothing!==void 0&&(d.vessel.audioSmoothing=t.vessel.audioSmoothing),t.vessel.hueShiftRange!==void 0&&(d.vessel.hueShiftRange=t.vessel.hueShiftRange)}if(t.shadows?(t.shadows.enabled!==void 0&&(d.shadows.enabled=t.shadows.enabled),t.shadows.ground!==void 0&&(d.shadows.ground=t.shadows.ground),t.shadows.backdrop!==void 0&&(d.shadows.backdrop=t.shadows.backdrop),t.shadows.opacity!==void 0&&(d.shadows.opacity=t.shadows.opacity),t.shadows.color!==void 0&&(d.shadows.color=t.shadows.color)):(d.shadows.enabled=!0,d.shadows.ground=!0,d.shadows.backdrop=!0,d.shadows.opacity=.25,d.shadows.color="#000000"),t.sprites?(d.sprites.enabled=t.sprites.enabled??!0,d.sprites.count=t.sprites.count??200):d.sprites={enabled:!0,count:200},t.particles?(t.particles.enabled!==void 0&&(d.particles.enabled=t.particles.enabled),t.particles.count!==void 0&&(d.particles.count=t.particles.count),t.particles.layout!==void 0&&(d.particles.layout=t.particles.layout),d.particles.hue=t.particles.hue??0,d.particles.size=t.particles.size??.02,d.particles.opacity=t.particles.opacity??.5,d.particles.organicMotion=t.particles.organicMotion??!1,d.particles.organicStrength=t.particles.organicStrength??.2,d.particles.audioReactiveHue=t.particles.audioReactiveHue??!1,d.particles.velocity=t.particles.velocity??((i=t.particles.motion)==null?void 0:i.velocity)??.05,d.particles.orbitalSpeed=t.particles.orbitalSpeed??t.particles.velocity??.05,d.particles.motionSmoothness=t.particles.motionSmoothness??.5,d.particles.minCount=t.particles.minCount??1e3,d.particles.maxCount=t.particles.maxCount??1e4,d.particles.minSize=t.particles.minSize??.005,d.particles.maxSize=t.particles.maxSize??.1,d.particlesMotion={velocity:.5,spread:t.particles.spread??((s=t.particles.motion)==null?void 0:s.spread)??1},(o=d==null?void 0:d.particles)!=null&&o.enabled?(mo(d.particles),console.log("✨ Particles reinitialized via initParticles")):d!=null&&d.particles||console.warn("⚠️ No state.particles found when loading preset")):(d.particles.layout="cube",d.particles.hue=0,d.particles.size=.02,d.particles.opacity=.5,d.particles.organicMotion=!1,d.particles.organicStrength=.2,d.particles.audioReactiveHue=!1,d.particles.velocity=.05,d.particles.orbitalSpeed=.05,d.particles.motionSmoothness=.5,d.particles.minCount=1e3,d.particles.maxCount=1e4,d.particles.minSize=.005,d.particles.maxSize=.1,d.particlesMotion={velocity:.5,spread:1}),t.colorLayers?(t.colorLayers.geometry&&(d.colorLayers.geometry.baseColor=t.colorLayers.geometry.baseColor??"#00ff00",d.colorLayers.geometry.audioColor=t.colorLayers.geometry.audioColor??"#ff0000",d.colorLayers.geometry.audioIntensity=t.colorLayers.geometry.audioIntensity??.5),t.colorLayers.vessel&&(d.colorLayers.vessel.baseColor=t.colorLayers.vessel.baseColor??"#00ff00",d.colorLayers.vessel.audioColor=t.colorLayers.vessel.audioColor??"#00ffff",d.colorLayers.vessel.audioIntensity=t.colorLayers.vessel.audioIntensity??.3),t.colorLayers.shadows&&(d.colorLayers.shadows.baseColor=t.colorLayers.shadows.baseColor??"#000000",d.colorLayers.shadows.audioColor=t.colorLayers.shadows.audioColor??"#333333",d.colorLayers.shadows.audioIntensity=t.colorLayers.shadows.audioIntensity??.2),t.colorLayers.particles&&(d.colorLayers.particles.baseColor=t.colorLayers.particles.baseColor??"#ffff00",d.colorLayers.particles.audioColor=t.colorLayers.particles.audioColor??"#ff00ff",d.colorLayers.particles.audioIntensity=t.colorLayers.particles.audioIntensity??.7),console.log("💾 ColorLayers loaded from preset")):console.log("💾 Legacy preset: colorLayers not found, using defaults"),t.emojiStreams?(d.emojiStreams=t.emojiStreams,window.emojiStreamManager&&(window.emojiStreamManager.loadStreams(t.emojiStreams),console.log(`🎨 Loaded ${t.emojiStreams.length} emoji streams`)),window.rebuildEmojiMixerUI&&window.rebuildEmojiMixerUI()):(d.emojiStreams=[],window.rebuildEmojiMixerUI&&window.rebuildEmojiMixerUI()),t.emojiSequencer?(d.emojiSequencer={enabled:t.emojiSequencer.enabled??!1,bpm:t.emojiSequencer.bpm??120,patterns:t.emojiSequencer.patterns??{},timelineLength:t.emojiSequencer.timelineLength??16,currentBeat:0},window.emojiSequencer&&(window.emojiSequencer.loadFromState(d.emojiSequencer),console.log(`🎶 Sequencer loaded: ${d.emojiSequencer.bpm} BPM, ${d.emojiSequencer.timelineLength} beats`)),window.rebuildSequencerGrid&&window.rebuildSequencerGrid()):(d.emojiSequencer={enabled:!1,bpm:120,currentBeat:0,patterns:{},timelineLength:16},window.rebuildSequencerGrid&&window.rebuildSequencerGrid()),t.emojiBanks){if(d.emojiBanks=t.emojiBanks,d.currentBank=t.currentBank??null,window.emojiBankManager){window.emojiBankManager.loadBanksFromState(t.emojiBanks);const a=d.emojiBanks.filter(r=>r!==null).length;console.log(`💾 Loaded ${a} pattern banks`)}window.updateBankButtonStates&&window.updateBankButtonStates()}else d.emojiBanks=[null,null,null,null,null,null,null,null],d.currentBank=null,window.updateBankButtonStates&&window.updateBankButtonStates();return console.log(`💾 Preset loaded: ${n}`),Qr({action:"loaded",presetName:n,presetData:t}),t}function Su(n){if(!n||typeof n!="string")return console.warn("💾 Invalid preset name:",n),!1;const e=js();return e[n]?(delete e[n],Mu(e),console.log(`💾 Preset deleted: ${n}`),Qr({action:"deleted",presetName:n}),!0):(console.warn(`💾 Preset not found: ${n}`),!1)}function vo(){const n=js();return Object.keys(n).sort()}typeof window<"u"&&(window.__PRESET_NAMES__=vo);function Gs(n){return js()[n]||null}function js(){try{const n=localStorage.getItem(vu);return n?JSON.parse(n):{}}catch(n){return console.error("💾 Error reading presets from localStorage:",n),{}}}function Mu(n){try{localStorage.setItem(vu,JSON.stringify(n))}catch(e){console.error("💾 Error saving presets to localStorage:",e)}}function Qr(n){Jy.forEach(e=>{try{e(n)}catch(t){console.error("💾 Error in preset callback:",t)}})}function bu(){const n=js();Object.keys(n).length===0&&(console.log("💾 Creating default presets..."),$i("Cube Default"),$i("Sphere Focus"),$i("Mixed Blend"))}const vi=Object.freeze(Object.defineProperty({__proto__:null,createDefaultPresets:bu,deletePreset:Su,getPresetData:Gs,initPresets:_u,listPresets:vo,loadPreset:Zr,savePreset:$i},Symbol.toStringTag,{value:"Module"}));console.log("🎛️ controlBindings.js loaded");const ao={geometry:{baseColor:{source:"HUD",midi:null,statePath:"colorLayers.geometry.baseColor"},audioColor:{source:"HUD",midi:null,statePath:"colorLayers.geometry.audioColor"},audioIntensity:{source:"HUD",midi:"CC20",statePath:"colorLayers.geometry.audioIntensity"}},vessel:{baseColor:{source:"HUD",midi:null,statePath:"colorLayers.vessel.baseColor"},audioColor:{source:"HUD",midi:null,statePath:"colorLayers.vessel.audioColor"},audioIntensity:{source:"HUD",midi:"CC21",statePath:"colorLayers.vessel.audioIntensity"}},shadows:{baseColor:{source:"HUD",midi:null,statePath:"colorLayers.shadows.baseColor"},audioColor:{source:"HUD",midi:null,statePath:"colorLayers.shadows.audioColor"},audioIntensity:{source:"HUD",midi:"CC22",statePath:"colorLayers.shadows.audioIntensity"}},particles:{baseColor:{source:"HUD",midi:null,statePath:"colorLayers.particles.baseColor"},audioColor:{source:"HUD",midi:null,statePath:"colorLayers.particles.audioColor"},audioIntensity:{source:"HUD",midi:"CC23",statePath:"colorLayers.particles.audioIntensity"},hueShift:{source:"HUD/MIDI",midi:"CC21",statePath:"particles.hue"}},morph:{sphereWeight:{source:"HUD/MIDI",midi:"CC10",statePath:"morphBaseWeights[0]"},cubeWeight:{source:"HUD/MIDI",midi:null,statePath:"morphBaseWeights[1]"},pyramidWeight:{source:"HUD/MIDI",midi:"CC22",statePath:"morphBaseWeights[2]"},torusWeight:{source:"HUD/MIDI",midi:"CC23",statePath:"morphBaseWeights[3]"}}},ro={};Object.keys(ao).forEach(n=>{Object.keys(ao[n]).forEach(e=>{const t=ao[n][e];t.midi&&(ro[t.midi]={category:n,property:e,statePath:t.statePath})})});function wu(n,e,t,i="HUD"){var a;const s=(a=ao[n])==null?void 0:a[e];if(!s){console.warn(`🎛️ [ControlBinding] Unknown binding: ${n}.${e}`);return}const o=s.statePath;console.log(`🎛️ [ControlUpdate] ${i} → ${n}.${e} = ${t} (${o})`),Eu(d,o,t);try{document.dispatchEvent(new CustomEvent("controlUpdate",{detail:{category:n,property:e,value:t,source:i,statePath:o}}))}catch{}}function Eu(n,e,t){const i=e.match(/^(.+)\[(\d+)\]$/);if(i){const a=i[1],r=parseInt(i[2]),c=a.split(".");let u=n;for(let h=0;h<c.length-1;h++)u=u[c[h]];const l=c[c.length-1];u[l]&&Array.isArray(u[l])&&(u[l][r]=t);return}const s=e.split(".");let o=n;for(let a=0;a<s.length-1;a++)o[s[a]]||(o[s[a]]={}),o=o[s[a]];o[s[s.length-1]]=t}function Cu(n){const e=`CC${n}`;return ro[e]||null}function Tu(n,e,t=i=>i/127){const i=Cu(n);if(i){const s=t(e);return wu(i.category,i.property,s,"MIDI"),!0}return!1}function hi(n,e,t="Preset"){console.log(`🎛️ [ControlUpdate] ${t} → ${n} = ${e}`),Eu(d,n,e);try{document.dispatchEvent(new CustomEvent("controlUpdate",{detail:{statePath:n,value:e,source:t}}))}catch{}}function Au(){console.log("🎛️ [ControlBinding] Initializing unified binding system"),console.log(`🎛️ [ControlBinding] Loaded ${Object.keys(ao).length} categories`),console.log(`🎛️ [ControlBinding] MIDI mappings: ${Object.keys(ro).length} CCs`),Object.keys(ro).forEach(n=>{const e=ro[n];console.log(`🎛️ [MIDI Map] ${n} → ${e.category}.${e.property}`)})}console.log("🎛️ Control binding system ready (Phase 11.2.3)");const Zy=Object.freeze(Object.defineProperty({__proto__:null,applyBinding:wu,applyDirectUpdate:hi,applyMIDIBinding:Tu,getBindingForCC:Cu,initDefaultBindings:Au},Symbol.toStringTag,{value:"Module"}));console.log("💾 presetRouter.js loaded");function Ra(){var n;(n=d.interpolation)!=null&&n.active&&(d.interpolation.active=!1,d.interpolation.startTime=null,d.interpolation.startState=null,d.interpolation.targetState=null,console.log("🎚️ Interpolation stopped cleanly"))}function el(){console.log("♻️ Chain reset to beginning"),W.active=!1,W.paused=!1,W.currentIndex=0,W.pausedAt=null,W.pausedProgress=0,W.presets=[],W.duration=2e3,W.loop=!1,W.shuffle=!1,W.stepStartTime=null,W.currentChainName=null,Ra(),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainReset"))}function Qy(){Ra(),_o(),Jd(),console.log("♻️ Reset to baseline"),typeof window<"u"&&window.dispatchEvent(new CustomEvent("appReset",{detail:{ok:!0}}))}al(n=>{if(n.type==="app:reset"){Qy();return}if(n.presetAction!==void 0){if(n.presetAction==="chain:start"){const e=n.chainPresets||[],t=n.chainDuration??2e3;if(!Array.isArray(e)||e.length===0){console.warn("💾 [PresetRouter] Missing preset list for chain, aborting");return}const i={loop:n.chainLoop??!1,shuffle:n.chainShuffle??!1};nl(e,t,i);return}if(n.presetAction==="chain:stop"){_o();return}if(n.presetAction==="chain:save"){const e=n.chainName,t=n.chainPresets||[],i=n.chainDuration??2e3,s=n.chainLoop??!1,o=n.chainShuffle??!1;il(e,t,i,s,o);return}if(n.presetAction==="chain:load"){Ou(n.chainName);return}if(n.presetAction==="chain:delete"){Bu(n.chainName);return}if(n.presetAction==="chain:export"){Gu();return}if(n.presetAction==="chain:import"){n.file?ju(n.file):console.warn("💾 [PresetRouter] Import chains missing file");return}if(n.presetAction==="chain:pause"){Lu();return}if(n.presetAction==="chain:resume"){Iu();return}if(n.presetAction==="chain:skipNext"){Du();return}if(n.presetAction==="chain:skipPrev"){Uu();return}if(n.presetAction==="chain:reset"){el();return}ev(n.presetAction,n.presetName,n.category,n.tags)}});function ev(n,e,t,i){if(console.log("💾 [PresetRouter] handlePresetAction called:",{action:n,presetName:e,category:t,tags:i}),!e&&n!=="export"&&n!=="import"){console.warn("💾 [PresetRouter] Missing preset name, aborting");return}switch(n){case"save":const s={morphWeights:{...d.morphWeights},morphState:{...d.morphState},rotationX:d.rotationX,rotationY:d.rotationY,scale:d.scale,idleSpin:d.idleSpin,color:d.color,hue:d.hue,lighting:{...d.lighting},audio:{...d.audio},colorLayers:JSON.parse(JSON.stringify(d.colorLayers)),mandala:{enabled:d.mandala.enabled,ringCount:d.mandala.ringCount,symmetry:d.mandala.symmetry,audioReactive:d.mandala.audioReactive,ringSpacing:d.emojiMandala.ringSpacing??1,baseRadius:d.emojiMandala.baseRadius??1,globalScale:d.emojiMandala.globalScale??1,layout:d.emojiMandala.layout??"Classic",rainbowMode:d.emojiMandala.rainbowMode??!1}};console.log("💾 [PresetRouter] Calling savePreset with:",{presetName:e,category:t,tags:i,stateKeys:Object.keys(s)}),$i(e,s,t,i)&&(console.log(`💾 Saved preset: ${e} [${t}] ${i?i.join(", "):""}`),d.presets.currentPresetName=e,Pe(async()=>{const{updatePresetList:l}=await Promise.resolve().then(()=>co);return{updatePresetList:l}},void 0,import.meta.url).then(({updatePresetList:l})=>{Pe(async()=>{const{listPresets:h}=await Promise.resolve().then(()=>vi);return{listPresets:h}},void 0,import.meta.url).then(({listPresets:h})=>{l(h())})}));break;case"load":if(d.interpolation.enabled){tl(e);break}const o=Zr(e);if(o&&o.state){if(console.log(`💾 Loading preset: ${e} (Phase 11.2.3+ unified routing, interpolation disabled)`),o.state.morphWeights&&(qd(o.state.morphWeights),console.log("🎛️ [ControlUpdate] Preset → morphWeights (via setMorphWeights)")),o.state.morphState&&(Object.assign(d.morphState,o.state.morphState),console.log("🎛️ [ControlUpdate] Preset → morphState (direct)")),o.state.rotationX!==void 0&&hi("rotationX",o.state.rotationX,"Preset"),o.state.rotationY!==void 0&&hi("rotationY",o.state.rotationY,"Preset"),o.state.scale!==void 0&&hi("scale",o.state.scale,"Preset"),o.state.idleSpin!==void 0&&hi("idleSpin",o.state.idleSpin,"Preset"),o.state.color!==void 0&&($r(o.state.color),console.log(`🎛️ [ControlUpdate] Preset → color = ${o.state.color} (via setColor)`)),o.state.hue!==void 0&&(qr(o.state.hue),console.log(`🎛️ [ControlUpdate] Preset → hue = ${o.state.hue} (via setHue)`)),o.state.lighting&&Object.keys(o.state.lighting).forEach(l=>{hi(`lighting.${l}`,o.state.lighting[l],"Preset")}),o.state.audio&&Object.keys(o.state.audio).forEach(l=>{hi(`audio.${l}`,o.state.audio[l],"Preset")}),o.state.colorLayers&&Object.keys(o.state.colorLayers).forEach(l=>{Object.keys(o.state.colorLayers[l]).forEach(h=>{hi(`colorLayers.${l}.${h}`,o.state.colorLayers[l][h],"Preset")})}),o.state.mandala){d.mandala.enabled=o.state.mandala.enabled??!1,d.mandala.ringCount=o.state.mandala.ringCount??6,d.mandala.symmetry=o.state.mandala.symmetry??6,d.mandala.audioReactive=o.state.mandala.audioReactive??!1,d.emojiMandala.enabled=d.mandala.enabled,d.emojiMandala.rings=d.mandala.ringCount,d.emojiMandala.symmetry=d.mandala.symmetry,d.emojiMandala.ringSpacing=o.state.mandala.ringSpacing??1,d.emojiMandala.baseRadius=o.state.mandala.baseRadius??1,d.emojiMandala.globalScale=o.state.mandala.globalScale??1,d.emojiMandala.layout=o.state.mandala.layout??"Classic",d.emojiMandala.rainbowMode=o.state.mandala.rainbowMode??!1;const l=d.mandala.enabled?"ON":"OFF",h=d.mandala.audioReactive?"ON":"OFF";console.log(`💾 Preset → Mandala restored: ${l} | rings=${d.mandala.ringCount} | symmetry=${d.mandala.symmetry} | audioReactive=${h}`)}d.presets.currentPresetName=e,console.log(`✅ Preset "${e}" loaded via unified binding system`)}break;case"update":const a=Gs(e),r=t||(a?a.category:"Uncategorized"),c=i||(a?a.tags:[]),u={morphWeights:{...d.morphWeights},morphState:{...d.morphState},rotationX:d.rotationX,rotationY:d.rotationY,scale:d.scale,idleSpin:d.idleSpin,color:d.color,hue:d.hue,lighting:{...d.lighting},audio:{...d.audio},colorLayers:JSON.parse(JSON.stringify(d.colorLayers)),mandala:{enabled:d.mandala.enabled,ringCount:d.mandala.ringCount,symmetry:d.mandala.symmetry,audioReactive:d.mandala.audioReactive,ringSpacing:d.emojiMandala.ringSpacing??1,baseRadius:d.emojiMandala.baseRadius??1,globalScale:d.emojiMandala.globalScale??1,layout:d.emojiMandala.layout??"Classic",rainbowMode:d.emojiMandala.rainbowMode??!1}};$i(e,u,r,c)&&(console.log(`💾 Updated preset: ${e} [${r}] ${c.join(", ")}`),d.presets.currentPresetName=e,Pe(async()=>{const{updatePresetList:l}=await Promise.resolve().then(()=>co);return{updatePresetList:l}},void 0,import.meta.url).then(({updatePresetList:l})=>{Pe(async()=>{const{listPresets:h}=await Promise.resolve().then(()=>vi);return{listPresets:h}},void 0,import.meta.url).then(({listPresets:h})=>{l(h())})}));break;case"delete":Su(e)&&(console.log(`💾 Deleted preset: ${e}`),d.presets.currentPresetName===e&&(d.presets.currentPresetName=null),Pe(async()=>{const{updatePresetList:l}=await Promise.resolve().then(()=>co);return{updatePresetList:l}},void 0,import.meta.url).then(({updatePresetList:l})=>{Pe(async()=>{const{listPresets:h}=await Promise.resolve().then(()=>vi);return{listPresets:h}},void 0,import.meta.url).then(({listPresets:h})=>{l(h())})}));break;case"export":tv();break;case"import":update.file?nv(update.file):console.warn("💾 Import action missing file");break;default:console.warn(`💾 Unknown preset action: ${n}`)}}function tv(){const n={},e=vo();e.forEach(a=>{const r=Gs(a);r&&(n[a]=r)});const t=JSON.stringify(n,null,2),i=new Blob([t],{type:"application/json"}),s=URL.createObjectURL(i),o=document.createElement("a");o.href=s,o.download=`presets_${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s),console.log(`💾 ✅ Exported ${e.length} presets to ${o.download}`);try{document.dispatchEvent(new CustomEvent("presetsExported",{detail:{presetCount:e.length,filename:o.download}}))}catch{}}function nv(n){const e=new FileReader;e.onload=t=>{try{const i=JSON.parse(t.target.result);let s=0,o=0;Object.keys(i).forEach(a=>{const r=i[a];Gs(a)?o++:s++;const u={morphWeights:r.morphWeights||{},morphState:r.morphState||{},rotationX:r.rotationX||0,rotationY:r.rotationY||0,scale:r.scale||1,idleSpin:r.idleSpin!==void 0?r.idleSpin:!0,color:r.color||"#00ff00",hue:r.hue||0,lighting:r.visualSettings||r.lighting||{},audio:r.audio||{},colorLayers:r.colorLayers||{},vessel:r.vessel||{},shadows:r.shadows||{},sprites:r.sprites||{},particles:r.particles||{}},l=r.category||"Uncategorized",h=Array.isArray(r.tags)?r.tags:[];$i(a,u,l,h)}),console.log(`💾 ✅ Imported ${s+o} presets (${s} new, ${o} overwritten) from ${n.name}`),Pe(async()=>{const{updatePresetList:a}=await Promise.resolve().then(()=>co);return{updatePresetList:a}},void 0,import.meta.url).then(({updatePresetList:a})=>{a(vo())});try{document.dispatchEvent(new CustomEvent("presetsImported",{detail:{filename:n.name,totalCount:s+o,newCount:s,overwriteCount:o}}))}catch{}}catch(i){console.error(`💾 ❌ Failed to import presets from ${n.name}:`,i),alert(`Failed to import presets: ${i.message}`)}},e.onerror=()=>{console.error(`💾 ❌ Failed to read file: ${n.name}`),alert(`Failed to read file: ${n.name}`)},e.readAsText(n)}function tl(n){if(!d.interpolation.enabled){Zr(n)&&console.log(`💾 Loaded preset immediately (interpolation disabled): ${n}`);return}const e=Gs(n);if(!e){console.warn(`💾 Cannot interpolate: preset "${n}" not found`);return}d.interpolation.active=!1,d.interpolation.startState=null,d.interpolation.targetState=null,d.interpolation.startState={morphBaseWeights:[...d.morphBaseWeights],rotationX:d.rotationX,rotationY:d.rotationY,scale:d.scale,idleSpin:d.idleSpin,colorLayers:{geometry:{baseColor:d.colorLayers.geometry.baseColor},vessel:{baseColor:d.colorLayers.vessel.baseColor},shadows:{baseColor:d.colorLayers.shadows.baseColor},particles:{baseColor:d.colorLayers.particles.baseColor}},lighting:{...d.lighting}},d.interpolation.targetState={morphWeights:e.morphWeights||{},rotationX:e.rotationX||0,rotationY:e.rotationY||0,scale:e.scale||1,idleSpin:e.idleSpin!==void 0?e.idleSpin:!0,colorLayers:e.colorLayers||{},lighting:e.visualSettings||e.lighting||{}},d.interpolation.active=!0,d.interpolation.startTime=performance.now(),console.log(`🎚️ Interpolation started → ${n} (duration: ${d.interpolation.duration}ms)`),console.log("🎚️ Interpolation restarted cleanly")}function Ru(){if(!d.interpolation.active)return;const n=performance.now()-d.interpolation.startTime,e=Math.min(n/d.interpolation.duration,1),t=Kd(e),i=d.interpolation.startState,s=d.interpolation.targetState;if(i.morphBaseWeights&&s.morphWeights){const o=[s.morphWeights.sphere||0,s.morphWeights.cube||0,s.morphWeights.pyramid||0,s.morphWeights.torus||0];d.morphBaseWeights=Yd(i.morphBaseWeights,o,t),Math.random()<.05&&console.log("🔄 Interpolation write",{t:t.toFixed(2),morphBaseWeights:d.morphBaseWeights.slice(0,4).map(a=>a.toFixed(2))})}i.rotationX!==void 0&&s.rotationX!==void 0&&(d.rotationX=Dn(i.rotationX,s.rotationX,t)),i.rotationY!==void 0&&s.rotationY!==void 0&&(d.rotationY=Dn(i.rotationY,s.rotationY,t)),i.scale!==void 0&&s.scale!==void 0&&(d.scale=Dn(i.scale,s.scale,t)),["geometry","vessel","shadows","particles"].forEach(o=>{var a,r,c,u;(r=(a=i.colorLayers)==null?void 0:a[o])!=null&&r.baseColor&&((u=(c=s.colorLayers)==null?void 0:c[o])!=null&&u.baseColor)&&(d.colorLayers[o].baseColor=Xd(i.colorLayers[o].baseColor,s.colorLayers[o].baseColor,t))}),i.lighting&&s.lighting&&(i.lighting.ambientIntensity!==void 0&&s.lighting.ambientIntensity!==void 0&&(d.lighting.ambientIntensity=Dn(i.lighting.ambientIntensity,s.lighting.ambientIntensity,t)),i.lighting.directionalIntensity!==void 0&&s.lighting.directionalIntensity!==void 0&&(d.lighting.directionalIntensity=Dn(i.lighting.directionalIntensity,s.lighting.directionalIntensity,t))),Math.floor(e*10)!==Math.floor((e-.01)*10)&&console.log(`🎚️ Interpolation progress: t=${e.toFixed(2)} (eased: ${t.toFixed(2)})`),e>=1&&(d.interpolation.active=!1,d.interpolation.startState=null,d.interpolation.targetState=null,console.log("✅ Interpolation complete"))}function Lr(){return d.interpolation.active}function nl(n=[],e=2e3,t={}){if(!Array.isArray(n)||n.length<2){console.warn("🔗 [Chain] Need at least 2 presets to start a chain.",n);return}el(),console.log("🔗 Starting new chain...");let i=n.slice();(t.shuffle||W.shuffle)&&(i=Pu(i),console.log(`🔀 Shuffle enabled → randomized order: [${i.join(", ")}]`)),W.presets=i,W.currentIndex=0,W.active=!0,W.duration=e,t.loop!==void 0&&(W.loop=t.loop),t.shuffle!==void 0&&(W.shuffle=t.shuffle),t.chainName!==void 0&&(W.currentChainName=t.chainName);const s=W.presets[0],o=W.loop?" [LOOP ENABLED]":"";console.log(`🔗 Chain started: ${W.presets.join(" → ")} (duration: ${e}ms)${o}`),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainStarted",{detail:{presets:W.presets,duration:e,loop:W.loop,shuffle:W.shuffle}})),go(s,e)}function Pu(n){const e=n.slice();for(let t=e.length-1;t>0;t--){const i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}return e}function _o(){W.active&&(console.log("🔗 Chain stopped."),W.active=!1,W.currentIndex=0,W.currentChainName=null,Ra(),window.dispatchEvent(new CustomEvent("chainStopped",{detail:{reason:"manual stop"}})))}function go(n,e){if(!Gs(n))return console.warn("🔗 [Chain] Missing preset:",n),_o();W.stepStartTime=performance.now();const i=d.interpolation.duration;d.interpolation.duration=e,tl(n),d.interpolation.duration=i}function Lu(){if(!W.active||W.paused){console.warn("⏸ Cannot pause: chain not active or already paused");return}if(W.paused=!0,W.pausedAt=performance.now(),W.stepStartTime){const i=W.pausedAt-W.stepStartTime;W.pausedProgress=Math.min(i/W.duration,1)}d.interpolation.active&&(d.interpolation.active=!1);const n=W.currentIndex+1,e=W.presets.length,t=Math.round(n/e*100);console.log(`⏸ Chain paused at Step ${n}/${e} (${t}%)`),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainPaused",{detail:{currentStep:n,totalSteps:e,progress:t}}))}function Iu(){if(!W.active||!W.paused){console.warn("▶️ Cannot resume: chain not active or not paused");return}if(W.paused=!1,W.stepStartTime&&W.pausedAt){const n=performance.now()-W.pausedAt;W.stepStartTime+=n}W.pausedAt=null,W.pausedProgress<1&&(W.presets[W.currentIndex],d.interpolation.active=!0,d.interpolation.startTime=performance.now()-W.duration*W.pausedProgress),console.log("▶️ Chain resumed"),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainResumed",{detail:{resumed:!0}}))}function Du(){if(!W.active){console.warn("⏭ Cannot skip: chain not active");return}const n=W.currentIndex;if(W.currentIndex=(W.currentIndex+1)%W.presets.length,W.currentIndex===0&&!W.loop&&n===W.presets.length-1){_o(),console.log("⏭ Skipped to end → Chain stopped (loop disabled)");return}const e=W.presets[W.currentIndex];console.log(`⏭ Skipped → Next preset: ${e}`),W.paused=!1,W.pausedAt=null,W.pausedProgress=0,go(e,W.duration),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainSkipped",{detail:{direction:"next",preset:e,currentStep:W.currentIndex+1,totalSteps:W.presets.length}}))}function Uu(){if(!W.active){console.warn("⏮ Cannot skip: chain not active");return}if(W.currentIndex=W.currentIndex-1,W.currentIndex<0)if(W.loop)W.currentIndex=W.presets.length-1;else{W.currentIndex=0,console.log("⏮ Already at first preset");return}const n=W.presets[W.currentIndex];console.log(`⏮ Skipped → Previous preset: ${n}`),W.paused=!1,W.pausedAt=null,W.pausedProgress=0,go(n,W.duration),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainSkipped",{detail:{direction:"prev",preset:n,currentStep:W.currentIndex+1,totalSteps:W.presets.length}}))}let nd=0;function Fu(){if(W.active&&!W.paused){if(Lr()&&W.stepStartTime){const n=performance.now();if(n-nd>100){nd=n;const e=n-W.stepStartTime,t=W.duration,i=Math.min(e/t,1),s=Math.floor(i*100),a=(Math.max(t-e,0)/1e3).toFixed(1),r=W.currentIndex+1,c=W.presets.length;typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainProgress",{detail:{step:r,total:c,percent:s,remaining:a}})),s%10===0&&s>0&&console.log(`📊 Step ${r}/${c} progress: ${s}% (Remaining: ${a}s)`)}}if(!Lr())if(W.currentIndex<W.presets.length-1){W.currentIndex+=1;const n=W.presets[W.currentIndex],e=Math.round(W.currentIndex/W.presets.length*100);console.log(`✅ Step complete. Next → ${n}`),console.log(`📊 Chain progress: Step ${W.currentIndex+1}/${W.presets.length} (${e}%)`),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainStepComplete",{detail:{currentStep:W.currentIndex+1,totalSteps:W.presets.length,next:n,progress:e}})),go(n,W.duration)}else if(W.loop){if(console.log("🔁 Loop enabled → restarting chain"),W.currentIndex=0,W.shuffle){const e=W.presets.slice();W.presets=Pu(e),console.log(`🔀 Reshuffled → new order: [${W.presets.join(", ")}]`)}typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainLoopRestarted",{detail:{presets:W.presets,loop:W.loop,shuffle:W.shuffle}}));const n=W.presets[0];console.log(`📊 Chain progress: Step 1/${W.presets.length} (0%)`),go(n,W.duration)}else W.active=!1,W.currentChainName=null,console.log("🔗 Chain finished."),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainFinished",{detail:{completed:!0}}))}}const Nu="morphing_interface_chains";function il(n,e,t,i,s){if(!n||typeof n!="string")return console.warn("🔗 Invalid chain name:",n),!1;if(!Array.isArray(e)||e.length<2)return console.warn("🔗 Chain must have at least 2 presets:",e),!1;const o={name:n,presets:e.slice(),duration:t||2e3,loop:i||!1,shuffle:s||!1,timestamp:new Date().toISOString()},a=Ji();a[n]=o,Vu(a);const r=W.savedChains.findIndex(c=>c.name===n);return r>=0?W.savedChains[r]=o:W.savedChains.push(o),console.log(`💾 Chain saved: ${n} (${e.length} presets, ${t}ms, loop: ${i}, shuffle: ${s})`),!0}function Ou(n){const t=Ji()[n];return t?(console.log(`💾 Loading chain: ${n}`),nl(t.presets,t.duration,{loop:t.loop,shuffle:t.shuffle,chainName:n}),t):(console.warn(`🔗 Chain not found: ${n}`),null)}function Bu(n){if(!n||typeof n!="string")return console.warn("🔗 Invalid chain name:",n),!1;const e=Ji();return e[n]?(delete e[n],Vu(e),W.savedChains=W.savedChains.filter(t=>t.name!==n),console.log(`🔗 Chain deleted: ${n}`),!0):(console.warn(`🔗 Chain not found: ${n}`),!1)}function ku(){const n=Ji();return Object.keys(n).sort()}function zu(n){return Ji()[n]||null}function Ji(){try{const n=localStorage.getItem(Nu);if(n){const e=JSON.parse(n);return W.savedChains=Object.values(e),e}return{}}catch(n){return console.error("🔗 Error reading chains from localStorage:",n),{}}}function Vu(n){try{localStorage.setItem(Nu,JSON.stringify(n))}catch(e){console.error("🔗 Error saving chains to localStorage:",e)}}Ji();function Hu(){if(!W.active||!W.stepStartTime)return 0;if(W.paused)return Math.max(0,W.duration*(1-W.pausedProgress));const n=performance.now()-W.stepStartTime;return Math.max(0,W.duration-n)}function iv(){if(!W.active)return null;const n=W.currentIndex+1,e=W.presets.length,t=Hu();let i=0;if(W.stepStartTime&&!W.paused){const s=performance.now()-W.stepStartTime;i=Math.min(s/W.duration,1)}else W.paused&&(i=W.pausedProgress);return{currentStep:n,totalSteps:e,stepProgress:i,timeRemaining:t,paused:W.paused,presetName:W.presets[W.currentIndex]}}function Gu(){const n=Ji(),e=Object.keys(n);if(e.length===0){console.warn("💾 No chains to export");return}const t=JSON.stringify(n,null,2),i=new Blob([t],{type:"application/json"}),s=URL.createObjectURL(i),o=document.createElement("a");o.href=s,o.download=`chains_${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s),console.log(`💾 Chains exported: ${o.download} (${e.length} chains)`),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainsExported",{detail:{chainCount:e.length,filename:o.download}}))}function ju(n){const e=new FileReader;e.onload=t=>{try{const i=JSON.parse(t.target.result);let s=0,o=0;if(typeof i!="object"||i===null)throw new Error("Invalid chain file format");Object.keys(i).forEach(a=>{const r=i[a];if(!r.name||!Array.isArray(r.presets)||r.presets.length<2){console.warn(`🔗 Skipping invalid chain: ${a}`);return}zu(a)?o++:s++,il(r.name,r.presets,r.duration||2e3,r.loop||!1,r.shuffle||!1)}),console.log(`📂 Chains imported: ${s+o} chains loaded (${s} new, ${o} overwritten) from ${n.name}`),Pe(async()=>{const{updateChainList:a}=await Promise.resolve().then(()=>co);return{updateChainList:a}},void 0,import.meta.url).then(({updateChainList:a})=>{a&&a(ku())}),typeof window<"u"&&window.dispatchEvent(new CustomEvent("chainsImported",{detail:{filename:n.name,totalCount:s+o,newCount:s,overwriteCount:o}}))}catch(i){console.error(`💾 ❌ Failed to import chains from ${n.name}:`,i),alert(`Failed to import chains: ${i.message}`)}},e.onerror=()=>{console.error(`💾 ❌ Failed to read file: ${n.name}`),alert(`Failed to read file: ${n.name}`)},e.readAsText(n)}console.log("💾 Preset routing configured");const id=Object.freeze(Object.defineProperty({__proto__:null,deleteChain:Bu,exportChains:Gu,getChainData:zu,getChainProgress:iv,getChainTimeRemaining:Hu,importChains:ju,isInterpolating:Lr,listChains:ku,loadChain:Ou,pauseChain:Lu,resetChain:el,resumeChain:Iu,saveChain:il,skipNext:Du,skipPrev:Uu,startChain:nl,startInterpolation:tl,stopChain:_o,stopInterpolation:Ra,updateChain:Fu,updateInterpolation:Ru},Symbol.toStringTag,{value:"Module"}));console.log("🌀 periaktos.js loaded");let sv="cube";function ov(){console.log("🌀 Periaktos initialized, state:",sv)}console.log("🔺 geometry.js loaded");let Ms=!1,sd=0;const od=300;let Sa=null,Bs=null;const av=document.querySelector("#app"),ft=new Px,qt=new un(75,window.innerWidth/window.innerHeight,.1,1e3),En=new Rx({canvas:av});En.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(En.domElement);const{composer:rv,afterimagePass:lv}=Ky(En,ft,qt);function cv(){const e=new Hr(1,4).toNonIndexed(),t=e.attributes.position.array;function i(y){return y.clone().normalize().multiplyScalar(.8)}function s(y){const g=y.x,p=y.y,_=y.z,v=Math.max(Math.abs(g),Math.abs(p),Math.abs(_))||1e-6;return new U(g/v,p/v,_/v).multiplyScalar(.8)}function o(y){const g=Math.abs(y.y),p=.75;if(g>.7){const _=Math.sign(y.y)||1;return new U(0,_*p,0)}else{const _=(1-g)*.8,v=ho.clamp(y.x,-1,1)*_,b=ho.clamp(y.z,-1,1)*_,P=y.y*p;return new U(v,P,b)}}const a=Math.PI*2;function r(y){return(y%a+a)%a}function c(y){const g=new Float32Array(y.length),p=y.length/3,_=Math.floor(Math.sqrt(p)),v=1,b=.3;let P=0;for(let C=0;C<=_;C++){const A=r(C/_*a);for(let F=0;F<=_;F++){const w=r(F/_*a),S=(v+b*Math.cos(w))*Math.cos(A),R=b*Math.sin(w),N=(v+b*Math.cos(w))*Math.sin(A);if(g[P++]=S,g[P++]=R,g[P++]=N,P>=g.length)break}if(P>=g.length)break}return g}function u(y){const g=new Float32Array(t.length);for(let p=0;p<t.length;p+=3){const _=new U(t[p],t[p+1],t[p+2]).normalize(),v=y(_);g[p]=v.x,g[p+1]=v.y,g[p+2]=v.z}return g}const l=u(i),h=u(s),f=u(o),m=c(t),x=e.clone();return x.morphAttributes.position=[new mt(l,3),new mt(h,3),new mt(f,3),new mt(m,3)],x}const sl=[new Yn({color:16711680,roughness:.7,metalness:.3}),new Yn({color:65280,roughness:.7,metalness:.3}),new Yn({color:255,roughness:.7,metalness:.3}),new Yn({color:16776960,roughness:.7,metalness:.3}),new Yn({color:65535,roughness:.7,metalness:.3}),new Yn({color:16711935,roughness:.7,metalness:.3})],Kn=new Yn({color:d.color,wireframe:!0,roughness:.7,metalness:.3}),dv=cv(),pt=new Pt(dv,Kn);pt.visible=!0;pt.position.set(0,0,0);pt.morphTargetInfluences=[0,1,0,0];function Wu(n){return n.add(pt),console.log("🔺 Morph Shape added to scene (cube-sphere conflation)"),ov(),console.log("🌀 Periaktos initialized"),pt}ft.add(pt);pv();qt.position.set(0,0,5);qt.lookAt(0,0,0);window.addEventListener("resize",()=>{qt.aspect=window.innerWidth/window.innerHeight,qt.updateProjectionMatrix(),En.setSize(window.innerWidth,window.innerHeight)});function uv(n,e,t){return Math.max(e,Math.min(t,n))}function hv(n){var a,r;const e=n.morphBaseWeights||[n.morphWeights.sphere||0,n.morphWeights.cube||0,n.morphWeights.pyramid||0,n.morphWeights.torus||0],t=pt.morphTargetInfluences.slice(),i=Ki();!n.audioReactive&&!Ms?(console.log("🎵 Geometry morph clamped to base (audio OFF)"),Ms=!0):n.audioReactive&&Ms&&(Ms=!1);const s=[(i.bass||0)*.1,(i.mid||0)*.1,(i.treble||0)*.1,((i.bass||0)+(i.mid||0)+(i.treble||0))/3*.1];n.morphAudioWeights=s;const o=n.audio.sensitivity||1;!n.audioReactive&&sd++%od===0&&console.log("🛑 Geometry clamp check",{baseWeights:e.slice(0,4),audioWeights:s.slice(0,4),influences_before:Array.from(pt.morphTargetInfluences).slice(0,4)});for(let c=0;c<pt.morphTargetInfluences.length;c++){const u=e[c]||0;n.audioReactive?(pt.morphTargetInfluences[c]=uv(u+s[c]*o,0,1),Ms&&(Ms=!1)):pt.morphTargetInfluences[c]=u}n.audioReactive||t.some((u,l)=>Math.abs(u-pt.morphTargetInfluences[l])>.001)&&sd%od===0&&console.log("🔴 Geometry bleed detected (audio OFF)",{prevInfluences:t.slice(0,4).map(u=>u.toFixed(3)),newInfluences:Array.from(pt.morphTargetInfluences).slice(0,4).map(u=>u.toFixed(3)),baseWeights:e.slice(0,4).map(u=>u.toFixed(3)),audioData:i,interpolationActive:(a=n.interpolation)==null?void 0:a.active,chainActive:(r=n.morphChain)==null?void 0:r.active}),Math.random()<.02&&console.log("🎛️ Base:",e.map(c=>c.toFixed(2)),"🎵 Audio:",s.map(c=>c.toFixed(2)),"➡️ Final:",Array.from(pt.morphTargetInfluences).map(c=>c.toFixed(2)))}function fv(){pt&&d.morphWeights&&hv(d);const n=d.colorLayers.geometry,e=Ki(),t=(e.bass+e.mid+e.treble)/3;let i=n.baseColor;d.audioReactive&&(i=Ca(n.baseColor,n.audioColor,n.audioIntensity,t),Math.random()<.02&&console.log(`🎨 Geometry: base=${n.baseColor} audio=${n.audioColor} final=${i}`)),d.useTextureOnMorph&&d.texture?(Kn.map=d.texture,Kn.color.set(16777215),Kn.needsUpdate=!0):(Kn.map=null,Kn.color.set(i),Kn.needsUpdate=!0),Sa&&(Sa.intensity=d.lighting.ambientIntensity),Bs&&(Bs.intensity=d.lighting.directionalIntensity,$u())}function pv(){Sa=new Hx(16777215,d.lighting.ambientIntensity),ft.add(Sa),Bs=new Vx(16777215,d.lighting.directionalIntensity),$u(),ft.add(Bs),console.log("🎨 Lighting system initialized")}function $u(){if(!Bs)return;const n=d.lighting.directionalAngleX*Math.PI/180,e=d.lighting.directionalAngleY*Math.PI/180;Bs.position.set(Math.sin(e)*Math.cos(n)*10,Math.sin(n)*10,Math.cos(e)*Math.cos(n)*10)}function qu(n){d.geometry.wireframe=!!n,n?pt.material=Kn:pt.material=sl,console.log(`🔲 Wireframe mode: ${n?"ON":"OFF"}`)}function Xu(n){d.geometry.skyboxMode=!!n,sl.forEach(e=>{e.side=n?hn:Fn}),Kn.side=n?hn:Fn,console.log(`📦 Skybox mode (double-sided): ${n?"ON":"OFF"}`)}function Yu(n){pt.position.set(0,0,0),pt.rotation.set(0,0,0);const t=new Mi().setFromObject(pt).getSize(new U),i=Math.max(t.x,t.y,t.z)||10,s=(qt.fov||75)*Math.PI/180,o=i*.5/Math.tan(s/2);qt.position.set(0,0,o*1.4),qt.lookAt(0,0,0),n&&typeof n.update=="function"&&n.update(),qt.aspect=window.innerWidth/window.innerHeight,qt.updateProjectionMatrix(),En.setSize(window.innerWidth,window.innerHeight,!1),console.log("🎯 Camera and morph shape centered")}let gr=0,xr=performance.now();function Ku(){var o,a,r,c,u;requestAnimationFrame(Ku),gr++;const n=performance.now();if(n-xr>5e3){const l=gr/(n-xr)*1e3,h=performance.memory?(performance.memory.usedJSHeapSize/1048576).toFixed(1):"N/A";console.log(`📊 FPS: ${l.toFixed(1)} | Mem: ${h}MB | Particles: ${d.particlesCount}`),gr=0,xr=n}Ru(),Fu();const e=(d.idleSpin?.01:0)+d.rotationX,t=(d.idleSpin?.01:0)+d.rotationY,i=d.scale;if(pt.rotation.x+=e,pt.rotation.y+=t,pt.scale.set(i,i,i),d.audioReactive&&mu(),fv(),Sy(d.audioReactive),d.particlesEnabled&&du(d.audioReactive,performance.now()*.001),ou(),Qx(),window.emojiParticles){const l=((o=d==null?void 0:d.audio)==null?void 0:o.level)??0;window.emojiParticles.update(l)}if(window.emojiStreamManager){const l=((a=d==null?void 0:d.audio)==null?void 0:a.level)??0;window.emojiStreamManager.update(l)}if(window.emojiSequencer&&window.emojiSequencer.update(),window.mandalaController){const l=((r=d==null?void 0:d.audio)==null?void 0:r.level)??0;(c=d.mandala)!=null&&c.audioReactive&&!window.__mandalaAudioLoggedOn?(console.log("🔊 Mandala audioReactive=ON"),window.__mandalaAudioLoggedOn=!0,window.__mandalaAudioLoggedOff=!1):!((u=d.mandala)!=null&&u.audioReactive)&&!window.__mandalaAudioLoggedOff&&(console.log("🔇 Mandala audioReactive=OFF"),window.__mandalaAudioLoggedOff=!0,window.__mandalaAudioLoggedOn=!1),window.mandalaController.update(l)}xu(),gu();const s=eh();s&&s.render(ft),d.motionTrailsEnabled?(lv.uniforms.damp.value=d.motionTrailIntensity,rv.render()):En.render(ft,qt)}Ku();console.log("🔺 Geometry module initialized with state-based architecture");const Gi=Object.freeze(Object.defineProperty({__proto__:null,camera:qt,centerCameraAndMorph:Yu,faceMaterials:sl,initMorphShape:Wu,morphMesh:pt,renderer:En,scene:ft,setSkyboxMode:Xu,setWireframeMode:qu},Symbol.toStringTag,{value:"Module"}));console.log("🎯 hudGeometry.js loaded");function mv(n,e={}){const t=document.createElement("div");t.className="hud-section geometry";const i=document.createElement("h3");i.textContent="Geometry",t.appendChild(i);const s=document.createElement("label");s.style.display="block",s.style.marginBottom="8px";const o=document.createElement("input");o.type="checkbox",o.checked=!!d.geometry.skyboxMode,o.addEventListener("change",()=>{Xu(o.checked)}),s.appendChild(o),s.appendChild(document.createTextNode(" Skybox Mode (double-sided)")),t.appendChild(s);const a=document.createElement("label");a.style.display="block",a.style.marginBottom="8px";const r=document.createElement("input");r.type="checkbox",r.checked=!!d.geometry.wireframe,r.addEventListener("change",()=>{qu(r.checked)}),a.appendChild(r),a.appendChild(document.createTextNode(" Wireframe")),t.appendChild(a);const c=document.createElement("button");c.textContent="Center Me",c.style.padding="8px 12px",c.style.marginTop="8px",c.style.cursor="pointer",c.addEventListener("click",()=>{Yu(e.controls)}),t.appendChild(c),n.appendChild(t),console.log("🎯 Geometry HUD section created")}console.log("🎯 hudGeometry.js ready");console.log("🎶 audioRouter.js loaded (Phase 13.31)");let yn={bass:0,mid:0,treble:0,level:0,spectrum:new Uint8Array(0)};function gv(n){return{bass:+n.bass||0,mid:+n.mid||0,treble:+n.treble||0,level:+n.level||0}}const ta=n=>Math.pow(Math.max(0,n),.6);function xv(n){var i;const e=((i=d.audio)==null?void 0:i.audioGain)??1,t=gv(n);return{bass:ta(t.bass)*e,mid:ta(t.mid)*e,treble:ta(t.treble)*e,level:ta(t.level)*e}}const Tt={startTime:0,rmsHistory:[],silentDuration:0,activeDuration:0,toneActive:!1};function yv(n){var s,o;const e=performance.now();Tt.startTime===0&&(Tt.startTime=e);const t=e-Tt.startTime;Tt.rmsHistory.push(n),Tt.rmsHistory.length>60&&Tt.rmsHistory.shift();const i=Tt.rmsHistory.reduce((a,r)=>a+r,0)/Tt.rmsHistory.length;!Tt.toneActive&&t>1e3&&i<.002?(Tt.silentDuration+=16,Tt.silentDuration>=1e3&&(console.log("🔊 Silent boot → auto test tone ON (220Hz)"),(s=st.setTestTone)==null||s.call(st,!0,220),Tt.toneActive=!0,Tt.silentDuration=0)):Tt.silentDuration=0,Tt.toneActive&&n>.01?(Tt.activeDuration+=16,Tt.activeDuration>=300&&(console.log("🔇 Mic activity → auto test tone OFF"),(o=st.setTestTone)==null||o.call(st,!1),Tt.toneActive=!1,Tt.activeDuration=0)):Tt.activeDuration=0}function vv(){console.log("🎧 Initializing audio router event relay...");let n=0;st.on("frame",e=>{var t,i,s;if(!e){console.warn("⚠️ audioRouter received null bands");return}try{const o=xv(e);yn.bass=o.bass,yn.mid=o.mid,yn.treble=o.treble,yn.level=o.level,yn.spectrum=st.getSpectrum(),(t=d.audio)!=null&&t.autoTone&&yv(o.level),n++%60===0&&console.log("🎧 Audio frame relay:",{bass:yn.bass.toFixed(3),mid:yn.mid.toFixed(3),treble:yn.treble.toFixed(3),level:yn.level.toFixed(3),hasCallback:!!((i=window==null?void 0:window.hudCallbacks)!=null&&i.audioReactive)}),(s=window==null?void 0:window.hudCallbacks)!=null&&s.audioReactive&&window.hudCallbacks.audioReactive(yn),cu(yn),qe()}catch(o){console.error("❌ audioRouter relay error:",o)}}),console.log("✅ Audio router event relay registered")}console.log("🎶 Audio routing configured (Phase 13.31)");(()=>{const n=["HUD audioReactive update","HUD(Audio): refresh","HUD(Particles): refresh","HUD(Mandala): refresh"],e=console.log;console.log=(...t)=>{const i=t[0];typeof i=="string"&&n.some(s=>i.includes(s))||e(...t)}})();window.__HUD_AUDIO_LOGS__=!1;const ol={listeners:new Set,subscribe(n){typeof n=="function"&&this.listeners.add(n)},unsubscribe(n){this.listeners.delete(n)},notify(){for(const n of this.listeners)try{n()}catch(e){console.error("HUD listener error:",e)}}};function qe(n){if(n&&typeof n=="object")if(console.log("📟 notifyHUDUpdate called with:",Object.keys(n)),typeof window._hudRouterCallback=="function")try{window._hudRouterCallback(n)}catch(e){console.error("📟 Error in HUD router callback:",e)}else console.warn("⚠️ No hudRouter callback registered!");else ol.notify()}function Pa(n,e){ol.subscribe(e)}(!window.hudCallbacks||typeof window.hudCallbacks!="object")&&(window.hudCallbacks={});window.hudCallbacks.notify=qe;console.log("📟 hud.js: HUD Signal Bridge online");function al(n){typeof n=="function"?(window._hudRouterCallback=n,console.log("📟 HUD router callback registered")):qe()}console.log("📟 HUD registry initialized");typeof Kc=="function"&&Pa("audio",Kc);typeof qc=="function"&&Pa("particles",qc);typeof $c=="function"&&Pa("mandala",$c);console.log("📟 hud.js loaded");function Ju(){const n=_v();document.body.appendChild(n),console.log("📟 HUD initialized")}function _v(){const n=document.createElement("div");n.id="hud-panel",n.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 14px;
    z-index: 1000;
    min-width: 200px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: thin;
  `;const e=document.createElement("style");e.textContent=`
    #hud-panel::-webkit-scrollbar {
      width: 6px;
    }
    #hud-panel::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }
    #hud-panel::-webkit-scrollbar-track {
      background: transparent;
    }
  `,document.head.appendChild(e);let t=!1;const i=document.createElement("div");i.style.cssText="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;";const s=document.createElement("h3");s.textContent="🔺 Geometry Controls",s.style.cssText="margin: 0; color: #00ff00;";const o=document.createElement("button");o.textContent="−",o.style.cssText=`
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
  `;const a=document.createElement("div");a.id="hud-controls-container",o.addEventListener("click",()=>{t=!t,t?(a.style.display="none",o.textContent="+",console.log("📟 HUD collapsed (minimal mode)")):(a.style.display="block",o.textContent="−",console.log("📟 HUD expanded (full mode)"))}),i.appendChild(s),i.appendChild(o),n.appendChild(i);const r=document.createElement("div");r.style.cssText=`
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
  `;const c=["Morph","Presets","Audio","Visual","Advanced","MIDI"],u={},l={};c.forEach(D=>{const _e=document.createElement("button");_e.textContent=D,_e.style.cssText=`
      background: #222;
      color: #aaa;
      border: 1px solid #444;
      padding: 5px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
    `,_e.addEventListener("click",()=>{c.forEach(ze=>{u[ze].style.background=ze===D?"#555":"#222",u[ze].style.color=ze===D?"white":"#aaa",l[ze].style.display=ze===D?"block":"none"}),console.log(`📟 Tab switched to: ${D}`)}),r.appendChild(_e),u[D]=_e;const lt=document.createElement("div");lt.id=`tab-${D.toLowerCase()}`,lt.style.display=D==="Morph"?"block":"none",a.appendChild(lt),l[D]=lt}),u.Morph.style.background="#555",u.Morph.style.color="white",a.insertBefore(r,a.firstChild),Xx(l.Morph,qe),vy(l.Presets,qe),ay(l.Audio,qe),Jx(l.Visual,qe,bt,ot);const h=document.createElement("h4");h.textContent="🍕 Emoji Particles",h.style.cssText="margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;",l.Visual.appendChild(h);const f=document.createElement("select");f.id="emojiPicker",f.style.cssText="margin-left: 8px; padding: 2px 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px;",["🍕","🌶️","🍄","⭐","🎵","💫"].forEach(D=>{const _e=document.createElement("option");_e.value=D,_e.textContent=D,f.appendChild(_e)}),f.disabled=!0;const m=bt("Enable Emoji Particles",!1,async D=>{if(d.useEmojiParticles=D,D){const{getParticleSystemInstance:_e}=await Pe(async()=>{const{getParticleSystemInstance:et}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:et}},void 0,import.meta.url),{scene:lt}=await Pe(async()=>{const{scene:et}=await Promise.resolve().then(()=>Gi);return{scene:et}},void 0,import.meta.url),ze=_e();if(ze&&ze.points&&(lt.remove(ze.points),console.log("✨ Default ParticleSystem disabled")),!window.emojiParticles){const{EmojiParticles:et}=await Pe(async()=>{const{EmojiParticles:_t}=await Promise.resolve().then(()=>Mt);return{EmojiParticles:_t}},void 0,import.meta.url);window.emojiParticles=new et(lt,500,f.value),console.log(`🍕 EmojiParticles enabled with ${f.value}`)}f.disabled=!1}else{const{getParticleSystemInstance:_e}=await Pe(async()=>{const{getParticleSystemInstance:et}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:et}},void 0,import.meta.url),{scene:lt}=await Pe(async()=>{const{scene:et}=await Promise.resolve().then(()=>Gi);return{scene:et}},void 0,import.meta.url),ze=_e();ze&&ze.points&&(lt.add(ze.points),console.log("✨ Default ParticleSystem restored")),window.emojiParticles&&(window.emojiParticles.dispose(),window.emojiParticles=null,console.log("🍕 EmojiParticles disabled")),f.disabled=!0}});m.title="Toggle audio-reactive emoji particles",f.addEventListener("change",D=>{window.emojiParticles&&window.emojiParticles.swapEmoji(D.target.value)});const x=document.createElement("div");x.style.cssText="display: flex; align-items: center; margin-bottom: 8px;",x.appendChild(m),x.appendChild(f),l.Visual.appendChild(x);const y=ot("Emoji Count",50,10,2e3,50,async D=>{if(window.emojiParticles){const _e=window.emojiParticles.emoji,lt=window.emojiParticles.layout,ze=window.emojiParticles.audioReactivity,{scene:et}=await Pe(async()=>{const{scene:Kt}=await Promise.resolve().then(()=>Gi);return{scene:Kt}},void 0,import.meta.url);window.emojiParticles.dispose();const{EmojiParticles:_t}=await Pe(async()=>{const{EmojiParticles:Kt}=await Promise.resolve().then(()=>Mt);return{EmojiParticles:Kt}},void 0,import.meta.url);window.emojiParticles=new _t(et,D,_e),window.emojiParticles.setLayout(lt),window.emojiParticles.setAudioReactivity(ze),console.log(`🍕 Emoji instanced count set to ${D}`)}});y.title="Number of emoji particles (10-2000, instanced rendering)",l.Visual.appendChild(y);const g=document.createElement("label");g.textContent="Layout",g.style.cssText="display: block; margin-top: 8px; margin-bottom: 4px; color: #999; font-size: 11px;",l.Visual.appendChild(g);const p=document.createElement("select");p.id="emojiLayout",p.style.cssText="width: 100%; padding: 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px;",[{value:"cube",label:"Cube"},{value:"sphere",label:"Sphere"},{value:"orbit",label:"Orbit"},{value:"random",label:"Random"},{value:"spiral",label:"Spiral 🌀"},{value:"wave",label:"Wave Grid 🌊"},{value:"burst",label:"Burst 💥"}].forEach(D=>{const _e=document.createElement("option");_e.value=D.value,_e.textContent=D.label,p.appendChild(_e)}),p.addEventListener("change",D=>{window.emojiParticles&&window.emojiParticles.setLayout(D.target.value)}),l.Visual.appendChild(p);const v=ot("Audio Reactivity",1,0,2,.1,D=>{window.emojiParticles&&window.emojiParticles.setAudioReactivity(D)});v.title="Multiplier for audio-reactive scale/rotation (0-2x)",l.Visual.appendChild(v);const b=bt("Link to Morph/Audio",!1,D=>{window.emojiParticles&&window.emojiParticles.setSignalLinking(D)});b.title="Link emoji particles to morph weights and audio bands (bass→expansion, mid→rotation, treble→sparkle)",l.Visual.appendChild(b);const P=document.createElement("label");P.textContent="Emoji Set",P.style.cssText="display: block; margin-top: 8px; margin-bottom: 4px; color: #999; font-size: 11px;",l.Visual.appendChild(P);const C=document.createElement("select");C.id="emojiSet",C.style.cssText="width: 100%; padding: 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px;",[{value:"",label:"Single Emoji"},{value:"pizza",label:"🍕 Pizza"},{value:"cosmos",label:"⭐ Cosmos"},{value:"myth",label:"🦁 Myth"},{value:"ocean",label:"🌊 Ocean"},{value:"nature",label:"🌲 Nature"},{value:"tech",label:"💻 Tech"}].forEach(D=>{const _e=document.createElement("option");_e.value=D.value,_e.textContent=D.label,C.appendChild(_e)}),C.addEventListener("change",D=>{window.emojiParticles&&D.target.value&&window.emojiParticles.loadEmojiSet(D.target.value)}),l.Visual.appendChild(C);const F=bt("Auto-Cycle Set",!1,D=>{window.emojiParticles&&window.emojiParticles.setAutoCycle(D,4e3)});F.title="Automatically cycle through emojis in the selected set (4s interval)",l.Visual.appendChild(F);const w=bt("Story Mode",!1,D=>{if(window.emojiParticles){const _e=["pizza","cosmos","myth"];window.emojiParticles.setStoryMode(D,_e)}});w.title="Enable narrative sequence: Pizza → Cosmos → Myth (use CC31 or manual advance)",l.Visual.appendChild(w);const S=document.createElement("h4");S.textContent="🥁 Beat Sync",S.style.cssText="margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;",l.Visual.appendChild(S);const R=ot("BPM",120,60,200,1,D=>{window.emojiParticles&&window.emojiParticles.setBPM(D)});R.title="Tempo in beats per minute for pulse/sequencer sync",l.Visual.appendChild(R);const N=bt("Enable Beat Sync",!1,D=>{window.emojiParticles&&window.emojiParticles.setBeatSync(D)});N.title="Pulse emojis on beat (scale/opacity)",l.Visual.appendChild(N);const k=document.createElement("label");k.textContent="Subdivision",k.style.cssText="display: block; margin-top: 8px; margin-bottom: 4px; color: #999; font-size: 11px;",l.Visual.appendChild(k);const G=document.createElement("select");G.style.cssText="width: 100%; padding: 4px; background: #1a1a1a; color: #00ffff; border: 1px solid #333; border-radius: 3px;",[{value:4,label:"Quarter Notes (1/4)"},{value:8,label:"Eighth Notes (1/8)"},{value:16,label:"Sixteenth Notes (1/16)"}].forEach(D=>{const _e=document.createElement("option");_e.value=D.value,_e.textContent=D.label,G.appendChild(_e)}),G.addEventListener("change",D=>{window.emojiParticles&&window.emojiParticles.setSubdivision(parseInt(D.target.value))}),l.Visual.appendChild(G);const X=bt("Onset Detection",!1,D=>{window.emojiParticles&&window.emojiParticles.setOnsetDetection(D)});X.title="Auto-detect beats from audio RMS spikes",l.Visual.appendChild(X);const Y=bt("Sequencer Mode",!1,D=>{if(window.emojiParticles){const _e=["🍕","🌶️","🍄","🧄"];window.emojiParticles.setSequencer(D,_e)}});Y.title="Step through emoji sequence on each beat (🍕 → 🌶️ → 🍄 → 🧄)",l.Visual.appendChild(Y);const J=document.createElement("h4");J.textContent="🎨 Emoji Mixer",J.style.cssText="margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;",l.Visual.appendChild(J);const V=document.createElement("div");V.id="emojiStreamsContainer",V.style.cssText="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;",l.Visual.appendChild(V);function ae(D="🍕",_e=100,lt=!0){const ze=document.createElement("div");ze.style.cssText="display: flex; align-items: center; gap: 6px; padding: 4px; background: rgba(0,0,0,0.3); border-radius: 4px;";const et=document.createElement("input");et.type="text",et.value=D,et.maxLength=2,et.style.cssText="width: 40px; font-size: 20px; text-align: center; background: rgba(255,255,255,0.1); border: 1px solid #00ffff; color: white; padding: 2px;";const _t=document.createElement("input");_t.type="range",_t.min=10,_t.max=500,_t.value=_e,_t.style.cssText="flex: 1; min-width: 80px;";const Kt=document.createElement("span");Kt.textContent=_e,Kt.style.cssText="font-size: 10px; color: #00ffff; min-width: 30px;";const Vn=document.createElement("input");Vn.type="checkbox",Vn.checked=lt,Vn.style.cssText="width: 16px; height: 16px;";const An=document.createElement("button");return An.textContent="✕",An.style.cssText="width: 24px; height: 24px; background: rgba(255,0,0,0.3); border: 1px solid red; color: red; cursor: pointer; border-radius: 4px; font-size: 12px;",et.addEventListener("input",()=>{const Jt=ze.dataset.emoji,Ci=et.value;Jt&&Ci&&Jt!==Ci&&window.emojiStreamManager&&(window.emojiStreamManager.removeStream(Jt),window.emojiStreamManager.addStream(Ci,parseInt(_t.value),Vn.checked),ze.dataset.emoji=Ci,ce())}),_t.addEventListener("input",()=>{Kt.textContent=_t.value,window.emojiStreamManager&&ze.dataset.emoji&&(window.emojiStreamManager.updateStreamCount(ze.dataset.emoji,parseInt(_t.value)),ce())}),Vn.addEventListener("change",()=>{window.emojiStreamManager&&ze.dataset.emoji&&(window.emojiStreamManager.toggleStream(ze.dataset.emoji,Vn.checked),ce())}),An.addEventListener("click",()=>{window.emojiStreamManager&&ze.dataset.emoji&&(window.emojiStreamManager.removeStream(ze.dataset.emoji),ze.remove(),ce(),window.rebuildSequencerGrid&&window.rebuildSequencerGrid())}),ze.dataset.emoji=D,ze.appendChild(et),ze.appendChild(_t),ze.appendChild(Kt),ze.appendChild(Vn),ze.appendChild(An),ze}function ce(){window.emojiStreamManager&&(d.emojiStreams=window.emojiStreamManager.getStreamsArray())}const ue=document.createElement("button");ue.textContent="+ Add Emoji Stream",ue.style.cssText="padding: 8px; background: rgba(0,255,255,0.2); border: 1px solid #00ffff; color: #00ffff; cursor: pointer; border-radius: 4px; font-size: 11px; margin-bottom: 10px;",ue.addEventListener("click",()=>{const D=["🍕","🌶️","🍄","⭐","🌙","🦁","🌊","🌲","💻","🔥"],_e=Array.from(V.querySelectorAll("[data-emoji]")).map(et=>et.dataset.emoji),lt=D.find(et=>!_e.includes(et))||"🎨",ze=ae(lt,100,!0);V.appendChild(ze),window.emojiStreamManager&&(window.emojiStreamManager.addStream(lt,100,!0),ce(),window.rebuildSequencerGrid&&window.rebuildSequencerGrid())}),l.Visual.appendChild(ue);function Fe(){V.innerHTML="",d.emojiStreams&&d.emojiStreams.length>0&&d.emojiStreams.forEach(({emoji:D,count:_e,enabled:lt})=>{const ze=ae(D,_e,lt);V.appendChild(ze)})}window.rebuildEmojiMixerUI=Fe,Fe();const He=document.createElement("h4");He.textContent="🎶 Emoji Sequencer",He.style.cssText="margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;",l.Visual.appendChild(He);const q=bt("Enable Sequencer",!1,D=>{window.emojiSequencer&&(window.emojiSequencer.setEnabled(D),d.emojiSequencer.enabled=D)});q.title="Enable beat-based emoji sequencing",l.Visual.appendChild(q);const te=ot("Sequencer BPM",120,60,200,1,D=>{window.emojiSequencer&&(window.emojiSequencer.setBPM(D),d.emojiSequencer.bpm=D)});te.title="Beats per minute for sequencer",l.Visual.appendChild(te);const re=ot("Timeline Length",16,4,32,1,D=>{window.emojiSequencer&&(window.emojiSequencer.setTimelineLength(D),d.emojiSequencer.timelineLength=D,fe())});re.title="Number of beats in the timeline",l.Visual.appendChild(re);const O=document.createElement("div");O.id="timelineGridContainer",O.style.cssText="margin: 10px 0; padding: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow-x: auto; max-height: 300px; overflow-y: auto;",l.Visual.appendChild(O);function fe(){if(!window.emojiSequencer)return;const D=document.getElementById("timelineGridContainer");if(!D)return;D.innerHTML="";const _e=Array.from(window.emojiStreamManager.streams.keys());if(_e.length===0){D.innerHTML='<div style="color: #888; font-size: 11px; padding: 10px;">Add emoji streams to use sequencer</div>';return}const lt=window.emojiSequencer.timelineLength,ze=document.createElement("div");ze.style.cssText="display: flex; margin-bottom: 4px; padding-left: 40px;";for(let et=0;et<lt;et++){const _t=document.createElement("div");_t.textContent=et+1,_t.style.cssText="width: 24px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #666; margin-right: 2px;",ze.appendChild(_t)}D.appendChild(ze),_e.forEach(et=>{const _t=document.createElement("div");_t.style.cssText="display: flex; align-items: center; margin-bottom: 4px;";const Kt=document.createElement("div");Kt.textContent=et,Kt.style.cssText="width: 30px; font-size: 18px; text-align: center; margin-right: 10px;",_t.appendChild(Kt);const Vn=window.emojiSequencer.getPattern(et);for(let An=0;An<lt;An++){const Jt=document.createElement("button");Jt.textContent="●",Jt.dataset.emoji=et,Jt.dataset.beat=An,Jt.style.cssText=`
          width: 24px;
          height: 24px;
          margin-right: 2px;
          border: 1px solid #00ffff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
        `;const Ci=Vn[An]===1;Jt.style.background=Ci?"rgba(0,255,255,0.6)":"rgba(0,0,0,0.3)",Jt.style.color=Ci?"#000":"#00ffff",Jt.addEventListener("click",()=>{const ul=window.emojiSequencer.toggleBeat(et,An);Jt.style.background=ul?"rgba(0,255,255,0.6)":"rgba(0,0,0,0.3)",Jt.style.color=ul?"#000":"#00ffff",d.emojiSequencer.patterns[et]=window.emojiSequencer.getPattern(et)}),_t.appendChild(Jt)}D.appendChild(_t)})}window.rebuildSequencerGrid=fe,fe();const Me=document.createElement("button");Me.textContent="↺ Reset to Beat 1",Me.style.cssText="padding: 6px 12px; background: rgba(0,255,255,0.2); border: 1px solid #00ffff; color: #00ffff; cursor: pointer; border-radius: 4px; font-size: 11px; margin-top: 8px;",Me.addEventListener("click",()=>{window.emojiSequencer&&window.emojiSequencer.reset()}),l.Visual.appendChild(Me);const Ie=document.createElement("h4");Ie.textContent="💾 Pattern Banks",Ie.style.cssText="margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;",l.Visual.appendChild(Ie);const L=document.createElement("div");L.style.cssText="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px;";const Ge=[];for(let D=0;D<8;D++){const _e=document.createElement("button");_e.textContent=`${D+1}`,_e.dataset.bankIndex=D,_e.style.cssText=`
      padding: 12px 8px;
      background: rgba(0,0,0,0.4);
      border: 1px solid #666;
      color: #666;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
      font-weight: bold;
      transition: all 0.2s;
      position: relative;
    `,_e.addEventListener("click",()=>{window.emojiBankManager&&window.emojiBankManager.loadBank(D)&&(d.currentBank=D,window.rebuildEmojiMixerUI&&window.rebuildEmojiMixerUI(),window.rebuildSequencerGrid&&window.rebuildSequencerGrid(),Ce())}),_e.addEventListener("contextmenu",lt=>{lt.preventDefault(),window.emojiBankManager&&(window.emojiBankManager.saveBank(D),d.emojiBanks=window.emojiBankManager.saveBanksToState(),Ce())}),Ge.push(_e),L.appendChild(_e)}l.Visual.appendChild(L);function Ce(){window.emojiBankManager&&Ge.forEach((D,_e)=>{const lt=window.emojiBankManager.isBankEmpty(_e),ze=d.currentBank===_e;if(lt)D.style.background="rgba(0,0,0,0.4)",D.style.borderColor="#666",D.style.color="#666",D.title=`Bank ${_e+1}: Empty
Left-click to load
Right-click to save current pattern`;else{const et=window.emojiBankManager.getBank(_e),_t=et.streams.map(Kt=>Kt.emoji).join("");D.style.background=ze?"rgba(0,255,255,0.4)":"rgba(0,255,0,0.2)",D.style.borderColor=ze?"#00ffff":"#00ff00",D.style.color=ze?"#00ffff":"#00ff00",D.title=`Bank ${_e+1}: ${et.name}
${_t}
Left-click to load
Right-click to save current pattern`}})}window.updateBankButtonStates=Ce,Ce();const Ne=document.createElement("div");Ne.style.cssText="display: flex; gap: 6px; margin-top: 8px;";const ge=document.createElement("button");ge.textContent="💾 Save to Selected",ge.style.cssText="flex: 1; padding: 6px; background: rgba(0,255,0,0.2); border: 1px solid #00ff00; color: #00ff00; cursor: pointer; border-radius: 4px; font-size: 11px;",ge.addEventListener("click",()=>{d.currentBank!==null&&window.emojiBankManager?(window.emojiBankManager.saveBank(d.currentBank),d.emojiBanks=window.emojiBankManager.saveBanksToState(),Ce()):console.warn("💾 No bank selected")}),ge.title="Save current emoji mix + sequencer to selected bank",Ne.appendChild(ge);const Xe=document.createElement("button");Xe.textContent="✕ Clear Selected",Xe.style.cssText="flex: 1; padding: 6px; background: rgba(255,0,0,0.2); border: 1px solid red; color: red; cursor: pointer; border-radius: 4px; font-size: 11px;",Xe.addEventListener("click",()=>{d.currentBank!==null&&window.emojiBankManager&&(window.emojiBankManager.clearBank(d.currentBank),d.emojiBanks=window.emojiBankManager.saveBanksToState(),Ce())}),Xe.title="Clear selected bank",Ne.appendChild(Xe),l.Visual.appendChild(Ne);const ve=document.createElement("div");ve.textContent="Left-click: Load | Right-click: Quick Save",ve.style.cssText="font-size: 10px; color: #888; margin-top: 6px; text-align: center;",l.Visual.appendChild(ve);const be=document.createElement("h4");be.textContent="🌐 Emoji Physics",be.style.cssText="margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;",l.Visual.appendChild(be);const je=document.createElement("label");je.textContent="Physics Mode",je.style.cssText="display: block; font-size: 11px; margin-bottom: 4px; color: #00ffff;",l.Visual.appendChild(je);const T=document.createElement("select");T.style.cssText="width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #00ffff; color: #00ffff; border-radius: 4px; margin-bottom: 10px; font-size: 11px;",[{value:"none",label:"None (Static)"},{value:"gravity",label:"Gravity (Fall Down)"},{value:"orbit",label:"Orbit Attraction (Pull to Center)"},{value:"repulsion",label:"Repulsion (Scatter Away)"}].forEach(D=>{const _e=document.createElement("option");_e.value=D.value,_e.textContent=D.label,T.appendChild(_e)}),T.addEventListener("change",()=>{const D=T.value;d.emojiPhysics.mode=D,window.emojiStreamManager&&window.emojiStreamManager.setPhysicsMode(D),window.emojiParticles&&window.emojiParticles.setPhysicsMode(D),console.log(`🌐 Emoji physics mode: ${D}`)}),l.Visual.appendChild(T);const j=bt("Enable Collisions",!0,D=>{d.emojiPhysics.collisionEnabled=D});j.title="Emojis bounce off each other gently",l.Visual.appendChild(j);const Q=bt("Audio Modulation",!0,D=>{d.emojiPhysics.audioModulation=D});Q.title="Gravity affected by bass, repulsion by treble",l.Visual.appendChild(Q);const ne=bt("Mouse Swirl",!1,D=>{d.emojiPhysics.mouseInteraction=D});ne.title="Drag mouse to create swirl forces",l.Visual.appendChild(ne);const ie=ot("Gravity Strength",.01,.001,.05,.001,D=>{d.emojiPhysics.gravityStrength=D});ie.title="Downward acceleration force",l.Visual.appendChild(ie);const Le=ot("Orbit Strength",.005,.001,.02,.001,D=>{d.emojiPhysics.orbitStrength=D});Le.title="Attraction force toward center",l.Visual.appendChild(Le);const he=ot("Repulsion Strength",.02,.001,.1,.001,D=>{d.emojiPhysics.repulsionStrength=D});he.title="Force pushing emojis away from center",l.Visual.appendChild(he);const de=document.createElement("h4");de.textContent="⚡ Emoji Fusion & Clusters",de.style.cssText="margin: 15px 0 10px 0; color: #ff00ff; font-size: 12px;",l.Visual.appendChild(de);const Be=bt("Enable Fusion",!1,D=>{d.emojiFusion.enabled=D,console.log(D?`⚡ Fusion enabled (threshold ${d.emojiFusion.threshold.toFixed(1)})`:"⚡ Fusion disabled")});Be.title="Particles merge into clusters when overlapping",l.Visual.appendChild(Be);const se=ot("Fusion Threshold",1,.1,2,.1,D=>{d.emojiFusion.threshold=D,console.log(`⚡ Fusion threshold = ${D.toFixed(1)}`)});se.title="Distance threshold for fusion (smaller = more fusions)",l.Visual.appendChild(se);const we=document.createElement("h4");we.textContent="🌌 Emoji Constellations",we.style.cssText="margin: 15px 0 10px 0; color: #ffaa00; font-size: 12px;",l.Visual.appendChild(we);const Je=document.createElement("label");Je.textContent="Constellation Pattern",Je.style.cssText="display: block; font-size: 11px; margin-bottom: 4px; color: #ffaa00;",l.Visual.appendChild(Je);const De=document.createElement("select");De.style.cssText="width: 100%; padding: 6px; background: rgba(0,0,0,0.5); border: 1px solid #ffaa00; color: #ffaa00; border-radius: 4px; margin-bottom: 10px; font-size: 11px;",[{value:"None",label:"None (Free Motion)"},{value:"Line",label:"Line"},{value:"Triangle",label:"Triangle"},{value:"Star",label:"5-Point Star ⭐"},{value:"Spiral",label:"Golden Spiral 🌀"},{value:"CircleOf5ths",label:"Circle of 5ths 🎵"},{value:"Platonic",label:"Platonic Solid (Icosahedron)"},{value:"Custom",label:"Custom Pattern (JSON)"}].forEach(D=>{const _e=document.createElement("option");_e.value=D.value,_e.textContent=D.label,De.appendChild(_e)}),De.addEventListener("change",()=>{const D=De.value;d.emojiConstellations.type=D,d.emojiConstellations.rotation=0,console.log(`🌌 Emoji constellation set: ${D}`)}),l.Visual.appendChild(De);const Ye=ot("Constellation Scale",5,1,15,.5,D=>{d.emojiConstellations.scale=D,console.log(`🌌 Constellation scale: ${D.toFixed(1)}`)});Ye.title="Size of the constellation pattern",l.Visual.appendChild(Ye);const We=ot("Rotation Speed",.01,0,.1,.005,D=>{d.emojiConstellations.rotationSpeed=D,console.log(`🌌 Rotation speed: ${D.toFixed(3)}`)});We.title="Speed of constellation rotation",l.Visual.appendChild(We);const ut=bt("Audio Sync Rotation",!0,D=>{d.emojiConstellations.audioSync=D,console.log(`🌌 Audio sync: ${D?"ON":"OFF"}`)});ut.title="Rotation modulated by audio level",l.Visual.appendChild(ut);const I=bt("Beat Sync Pulse",!1,D=>{d.emojiConstellations.beatSync=D,console.log(`🌌 Beat sync pulse: ${D?"ON":"OFF"}`)});I.title="Constellation pulses with sequencer beats",l.Visual.appendChild(I);const me=document.createElement("label");me.textContent="Upload Custom Pattern (JSON)",me.style.cssText="display: block; font-size: 11px; margin-top: 10px; margin-bottom: 4px; color: #ffaa00;",l.Visual.appendChild(me);const K=document.createElement("input");K.type="file",K.accept=".json",K.style.cssText="width: 100%; padding: 4px; background: rgba(0,0,0,0.5); border: 1px solid #ffaa00; color: #ffaa00; border-radius: 4px; margin-bottom: 10px; font-size: 11px;",K.addEventListener("change",async D=>{const _e=D.target.files[0];if(_e)try{const lt=await _e.text(),ze=JSON.parse(lt);if(!ze.positions||!Array.isArray(ze.positions)){console.error("❌ Invalid pattern format. Expected { positions: [{x, y, z?}, ...] }");return}d.emojiConstellations.customPattern=ze,d.emojiConstellations.type="Custom",De.value="Custom",console.log(`🌌 Loaded custom constellation → ${_e.name}`),console.log(`   ${ze.positions.length} positions loaded`)}catch(lt){console.error("❌ Failed to load pattern JSON:",lt.message)}}),l.Visual.appendChild(K),Kx(l.Visual,qe,bt,ot),mv(l.Visual,{controls:null});const Z=document.createElement("h4");Z.textContent="🌊 Particle Trails (Line Segments)",Z.style.cssText="margin: 15px 0 10px 0; color: #00ffff; font-size: 12px;",l.Visual.appendChild(Z);const oe=bt("Enable Line Trails",!1,D=>{qe({particlesTrailEnabled:D})});l.Visual.appendChild(oe);const ee=ot("Trail Length",0,0,10,1,D=>{qe({particlesTrailLength:D})});ee.title="Number of frames to persist (0-10)",l.Visual.appendChild(ee);const pe=ot("Trail Opacity",.3,0,1,.05,D=>{qe({particlesTrailOpacity:D})});pe.title="Transparency of trail lines (0.0-1.0)",l.Visual.appendChild(pe);const Te=ot("Trail Fade",1,0,1,.05,D=>{qe({particlesTrailFade:D})});Te.title="Strength of fading (0=no fade, 1=full taper)",l.Visual.appendChild(Te);const Ae=bt("Audio Reactive Length",!1,D=>{qe({particlesTrailAudioReactive:D})});Ae.title="Trail length follows audio level",l.Visual.appendChild(Ae);const Ve=ot("Min Length",2,1,10,1,D=>{qe({particlesTrailLengthMin:D})});Ve.title="Shortest trail when audio is quiet",l.Visual.appendChild(Ve);const ht=ot("Max Length",10,1,20,1,D=>{qe({particlesTrailLengthMax:D})});ht.title="Longest trail when audio is loud",l.Visual.appendChild(ht);const yt=document.createElement("h4");yt.textContent="🎞️ Motion Trails (Postprocessing)",yt.style.cssText="margin: 15px 0 10px 0; color: #ffcc00; font-size: 12px;",l.Visual.appendChild(yt);const Et=bt("Enable Motion Trails",!1,D=>{qe({motionTrailsEnabled:D})});Et.title="AfterimagePass blur effect (works independently of line trails)",l.Visual.appendChild(Et);const tn=ot("Trail Intensity",.96,.85,.99,.01,D=>{qe({motionTrailIntensity:D})});tn.title="Blur damp value (higher = longer trails)",l.Visual.appendChild(tn);const on=document.createElement("button");on.textContent="🔄 Reset to Defaults",on.style.cssText="width: 100%; padding: 10px; background: #ff9900; color: black; border: none; cursor: pointer; font-weight: bold; border-radius: 5px; margin-top: 15px; margin-bottom: 15px;",on.addEventListener("click",()=>{qe({particlesResetDefaults:!0})}),l.Visual.appendChild(on);const Cn=document.createElement("button");Cn.textContent="🎯 Center Me",Cn.style.cssText="width: 100%; padding: 10px; background: #00aaff; color: white; border: none; cursor: pointer; font-weight: bold; border-radius: 5px; margin-bottom: 15px; font-size: 14px;",Cn.addEventListener("click",async()=>{const{centerCameraAndMorph:D}=await Pe(async()=>{const{centerCameraAndMorph:_e}=await Promise.resolve().then(()=>Gi);return{centerCameraAndMorph:_e}},void 0,import.meta.url);D()}),Cn.title="Reset camera and morph shape to center position",l.Visual.appendChild(Cn);const On=document.createElement("hr");On.style.cssText="border: 1px solid #555; margin: 15px 0;",l.Visual.appendChild(On);const ni=document.createElement("h4");ni.textContent="🎨 Visual Polish",ni.style.cssText="margin: 0 0 10px 0; color: #ff66ff; font-size: 12px;",l.Visual.appendChild(ni),ty(l.Visual);const Bn=ot("Ambient Intensity",.4,0,2,.1,D=>{qe({ambientIntensity:D})});l.Visual.appendChild(Bn);const Zi=ot("Directional Intensity",1,0,2,.1,D=>{qe({directionalIntensity:D})});l.Visual.appendChild(Zi);const kn=ot("Light Angle X",-45,-90,90,5,D=>{qe({directionalAngleX:D})});l.Visual.appendChild(kn);const ii=ot("Light Angle Y",45,-90,90,5,D=>{qe({directionalAngleY:D})});l.Visual.appendChild(ii);const si=ln("Geometry Color","#00ff00",D=>{qe({color:D})});l.Visual.appendChild(si);const zn=document.createElement("hr");zn.style.cssText="border: 1px solid #555; margin: 15px 0;",l.Visual.appendChild(zn);const E=document.createElement("h4");E.textContent="🎨 Color Layers (Phase 11.2.2)",E.style.cssText="margin: 0 0 10px 0; color: #ff00ff; font-size: 12px;",l.Visual.appendChild(E);const B=document.createElement("h5");B.textContent="🔺 Geometry",B.style.cssText="margin: 10px 0 5px 0; color: #00ff00; font-size: 11px;",l.Visual.appendChild(B);const H=ln("Base Color","#00ff00",D=>{qe({colorLayer:"geometry",property:"baseColor",value:D})});l.Visual.appendChild(H);const $=ln("Audio Color","#ff0000",D=>{qe({colorLayer:"geometry",property:"audioColor",value:D})});l.Visual.appendChild($);const z=ot("Audio Intensity",.5,0,1,.05,D=>{qe({colorLayer:"geometry",property:"audioIntensity",value:D})});z.title="Controls audio color contribution (0 = none, 1 = full)",l.Visual.appendChild(z);const le=document.createElement("h5");le.textContent="🚢 Vessel",le.style.cssText="margin: 10px 0 5px 0; color: #00ffff; font-size: 11px;",l.Visual.appendChild(le);const Se=ln("Base Color","#00ff00",D=>{qe({colorLayer:"vessel",property:"baseColor",value:D})});l.Visual.appendChild(Se);const Ee=ln("Audio Color","#00ffff",D=>{qe({colorLayer:"vessel",property:"audioColor",value:D})});l.Visual.appendChild(Ee);const Re=ot("Audio Intensity",.3,0,1,.05,D=>{qe({colorLayer:"vessel",property:"audioIntensity",value:D})});Re.title="Controls audio color contribution (0 = none, 1 = full)",l.Visual.appendChild(Re);const ke=document.createElement("h5");ke.textContent="🌑 Shadows",ke.style.cssText="margin: 10px 0 5px 0; color: #888; font-size: 11px;",l.Visual.appendChild(ke);const $e=ln("Base Color","#000000",D=>{qe({colorLayer:"shadows",property:"baseColor",value:D})});l.Visual.appendChild($e);const Oe=ln("Audio Color","#333333",D=>{qe({colorLayer:"shadows",property:"audioColor",value:D})});l.Visual.appendChild(Oe);const nt=ot("Audio Intensity",.2,0,1,.05,D=>{qe({colorLayer:"shadows",property:"audioIntensity",value:D})});nt.title="Controls audio color contribution (0 = none, 1 = full)",l.Visual.appendChild(nt);const xt=document.createElement("h5");xt.textContent="✨ Particles (Shader - Infra Only)",xt.style.cssText="margin: 10px 0 5px 0; color: #ffff00; font-size: 11px;",l.Visual.appendChild(xt);const vt=ln("Base Color","#ffff00",D=>{qe({colorLayer:"particles",property:"baseColor",value:D})});vt.title="Ready but requires shader update (future phase)",l.Visual.appendChild(vt);const Bt=ln("Audio Color","#ff00ff",D=>{qe({colorLayer:"particles",property:"audioColor",value:D})});Bt.title="Ready but requires shader update (future phase)",l.Visual.appendChild(Bt);const it=ot("Audio Intensity",.7,0,1,.05,D=>{qe({colorLayer:"particles",property:"audioIntensity",value:D})});it.title="Ready but requires shader update (future phase)",l.Visual.appendChild(it),sy(l.Visual,qe);const Ue=document.createElement("hr");Ue.style.cssText="border: 1px solid #555; margin: 15px 0;",l.Visual.appendChild(Ue);const At=document.createElement("h4");At.textContent="📦 Shadow Box",At.style.cssText="margin: 0 0 10px 0; color: #888; font-size: 12px;",l.Visual.appendChild(At);const rt=bt("Project Particles",!1,D=>{qe({shadowBoxProjectParticles:D})});l.Visual.appendChild(rt);const an=Sv("Palette","Manual",["Manual","Alchemy Gold","Blake Indigo","Cosmic White"],D=>{qe({shadowBoxPalette:D})});an.title="Quick palette presets or manual color selection",l.Visual.appendChild(an);const wi=ot("Threshold",.5,0,1,.01,D=>{qe({shadowBoxThreshold:D})});wi.title="Cutoff point: below = background, above = foreground",l.Visual.appendChild(wi);const Tn=ot("Bleach Gain",1,.5,3,.1,D=>{qe({shadowBoxBleachGain:D})});Tn.title="Luminance amplification before threshold",l.Visual.appendChild(Tn);const Qi=ln("Background Color","#000000",D=>{qe({shadowBoxBgColor:D})});Qi.title="Color for pixels below threshold",l.Visual.appendChild(Qi);const wt=ln("Foreground Color","#ffffff",D=>{qe({shadowBoxFgColor:D})});wt.title="Color for pixels above threshold",l.Visual.appendChild(wt),ny(l.Visual,qe,bt,ot,ln);const pn=document.createElement("hr");pn.style.cssText="border: 1px solid #555; margin: 15px 0;",l.Visual.appendChild(pn);const Ei=document.createElement("h4");Ei.textContent="✨ Sprites",Ei.style.cssText="margin: 0 0 10px 0; color: #ffff00; font-size: 12px;",l.Visual.appendChild(Ei);const Yt=bt("Enable Sprites",!0,D=>{qe({spritesEnabled:D})});l.Visual.appendChild(Yt);const Ws=ot("Sprite Count",200,50,500,10,D=>{qe({spritesCount:D})});return l.Visual.appendChild(Ws),yy(l.Advanced,qe),my(l.MIDI,qe),n.appendChild(a),n}function bt(n,e,t){const i=document.createElement("div");i.style.cssText="margin-bottom: 15px;";const s=document.createElement("label");s.textContent=n+": ",s.style.cssText="display: block; margin-bottom: 5px;";const o=document.createElement("input");o.type="checkbox",o.checked=e,o.style.cssText="margin-right: 5px;",o.addEventListener("change",()=>{t(o.checked)});const a=document.createElement("span");return a.textContent=e?"ON":"OFF",a.style.cssText=`color: ${e?"#00ff00":"#ff6666"};`,o.addEventListener("change",()=>{a.textContent=o.checked?"ON":"OFF",a.style.color=o.checked?"#00ff00":"#ff6666"}),s.appendChild(o),s.appendChild(a),i.appendChild(s),i}function ot(n,e,t,i,s,o){const a=document.createElement("div");a.style.cssText="margin-bottom: 15px;";const r=document.createElement("label");r.textContent=n+": ",r.style.cssText="display: block; margin-bottom: 5px;";const c=document.createElement("input");c.type="range",c.min=t,c.max=i,c.step=s,c.value=e,c.style.cssText="width: 100%; margin-bottom: 5px;";const u=document.createElement("span");return u.textContent=e.toFixed(3),u.style.cssText="color: #00ff00; font-size: 12px;",c.addEventListener("input",()=>{const l=parseFloat(c.value);u.textContent=l.toFixed(3),o(l)}),a.appendChild(r),a.appendChild(c),a.appendChild(u),a}function Sv(n,e,t,i){const s=document.createElement("div");s.style.cssText="margin-bottom: 15px;";const o=document.createElement("label");o.textContent=n+": ",o.style.cssText="display: block; margin-bottom: 5px;";const a=document.createElement("select");return a.style.cssText="width: 100%; padding: 4px; background: #333; color: white; border: 1px solid #555;",t.forEach(r=>{const c=document.createElement("option");c.value=r,c.textContent=r.charAt(0).toUpperCase()+r.slice(1),r===e&&(c.selected=!0),a.appendChild(c)}),a.addEventListener("change",()=>{i(a.value)}),s.appendChild(o),s.appendChild(a),s}function ln(n,e,t){const i=document.createElement("div");i.style.cssText="margin-bottom: 15px;";const s=document.createElement("label");s.textContent=n+": ",s.style.cssText="display: block; margin-bottom: 5px;";const o=document.createElement("input");o.type="color",o.value=e,o.style.cssText="width: 60%; height: 32px; padding: 2px; background: #333; border: 1px solid #555; cursor: pointer; margin-right: 10px;";const a=document.createElement("span");return a.textContent=e.toUpperCase(),a.style.cssText="color: #00ff00; font-size: 12px; font-family: monospace;",o.addEventListener("change",()=>{const r=o.value;a.textContent=r.toUpperCase(),t(r)}),i.appendChild(s),i.appendChild(o),i.appendChild(a),i}function lo(n){const e=document.getElementById("hud-panel");if(e&&e.presetListContainer){const t=e.presetListContainer,i=e.setSelectedPreset,s=e.categoryFilter,o=e.tagFilter,a=e.searchInput;t.innerHTML="";const r=s?s.value:"All",c=o?o.value.trim():"",u=c?c.split(",").map(h=>h.trim().toLowerCase()).filter(h=>h.length>0):[],l=a?a.value.trim().toLowerCase():"";if(l&&console.log(`🔍 Search: ${l}`),s){const h=new Set(["All"]);Pe(async()=>{const{getPresetData:f}=await Promise.resolve().then(()=>vi);return{getPresetData:f}},void 0,import.meta.url).then(({getPresetData:f})=>{n.forEach(x=>{const y=f(x);y&&y.category&&h.add(y.category)});const m=s.value;s.innerHTML="",Array.from(h).sort().forEach(x=>{const y=document.createElement("option");y.value=x,y.textContent=x,x===m&&(y.selected=!0),s.appendChild(y)})})}if(n.length===0){const h=document.createElement("div");h.textContent="No presets saved yet",h.style.cssText="color: #666; font-size: 11px; text-align: center; padding: 10px;",t.appendChild(h);return}Pe(async()=>{const{getPresetData:h}=await Promise.resolve().then(()=>vi);return{getPresetData:h}},void 0,import.meta.url).then(({getPresetData:h})=>{let f=0;if(n.forEach(m=>{const x=h(m),y=(x==null?void 0:x.category)||"Uncategorized",g=(x==null?void 0:x.tags)||[];if(l){const b=m.toLowerCase().includes(l),P=y.toLowerCase().includes(l),C=g.some(A=>A.toLowerCase().includes(l));if(!b&&!P&&!C)return}if(r!=="All"&&y!==r)return;if(u.length>0){const b=g.map(C=>C.toLowerCase());if(!u.every(C=>b.includes(C)))return}f++;const p=document.createElement("div");p.className="preset-item",p.style.cssText=`
          padding: 6px 8px;
          margin-bottom: 3px;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
          transition: background 0.2s, border-color 0.2s;
        `;const _=document.createElement("div");_.textContent=m,_.style.cssText="font-weight: bold; margin-bottom: 3px;",p.appendChild(_);const v=document.createElement("div");v.style.cssText="font-size: 9px; color: #888;",v.textContent=`[${y}]`,g.length>0&&(v.textContent+=` ${g.map(b=>`#${b}`).join(" ")}`),p.appendChild(v),p.addEventListener("mouseenter",()=>{p.style.background="#3a3a3a",p.style.borderColor="#666"}),p.addEventListener("mouseleave",()=>{p.classList.contains("selected")||(p.style.background="#2a2a2a",p.style.borderColor="#444")}),p.addEventListener("click",()=>{t.querySelectorAll(".preset-item").forEach(b=>{b.classList.remove("selected"),b.style.background="#2a2a2a",b.style.borderColor="#444"}),p.classList.add("selected"),p.style.background="#0088ff",p.style.borderColor="#00aaff",i(m)}),t.appendChild(p)}),f===0){const m=document.createElement("div");m.textContent="No presets match filters",m.style.cssText="color: #666; font-size: 11px; text-align: center; padding: 10px;",t.appendChild(m)}})}}window.hudCallbacks.audioReactive=n=>{d.audio.bass=n.bass??0,d.audio.mid=n.mid??0,d.audio.treble=n.treble??0,d.audio.level=n.level??0,window.__HUD_AUDIO_LOGS__&&console.log("🔉 HUD audioReactive update →","bass:",n.bass.toFixed(2),"mid:",n.mid.toFixed(2),"treble:",n.treble.toFixed(2),"level:",n.level.toFixed(2))};setTimeout(()=>{st.start().then(n=>{n&&console.log("✅ Audio engine running")})},1e3);(function(){const e=document.body;if(!e)return;const t=document.createElement("button");t.textContent="🖥️ Projector Mode",t.title="Shift+P toggles; Esc exits",Object.assign(t.style,{position:"fixed",right:"12px",bottom:"12px",zIndex:99999,padding:"8px 12px",background:"#111",color:"#eee",border:"1px solid #444",borderRadius:"8px",cursor:"pointer",opacity:"0.85"}),t.addEventListener("mouseenter",()=>t.style.opacity="1"),t.addEventListener("mouseleave",()=>t.style.opacity="0.85"),t.addEventListener("click",()=>{var s;return(s=window.ProjectorMode)==null?void 0:s.toggle()}),e.appendChild(t);const i=new MutationObserver(()=>{const s=document.body.classList.contains("projector-mode")||document.documentElement.classList.contains("projector-mode");t.style.display=s?"none":"block"});i.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),i.observe(document.body,{attributes:!0,attributeFilter:["class"]})})();(function(){window.__AUDIO_LOG_ENABLED__=!1,window.__AUDIO_LOG_MIN_MS__=1e3,window.setAudioLog=(t=!0)=>{window.__AUDIO_LOG_ENABLED__=!!t,console.warn("🔧 Audio log:",t?"ON":"OFF")},window.setAudioLogRate=(t=1e3)=>{window.__AUDIO_LOG_MIN_MS__=Math.max(0,t|0),console.warn("🔧 Audio log rate set to",window.__AUDIO_LOG_MIN_MS__,"ms")};const e=console.log;console.log=function(...t){try{const i=t[0];if(typeof i=="string"&&i.startsWith("🔉 HUD audioReactive update")){if(!window.__AUDIO_LOG_ENABLED__)return;const s=performance.now(),o=console.__lastAudioHUD__||0;if(s-o<(window.__AUDIO_LOG_MIN_MS__??1e3))return;console.__lastAudioHUD__=s}}catch{}return e.apply(console,t)},console.warn("🛑 HUD audio log gated (Phase 13.25.2). Use setAudioLog(true) to enable, setAudioLog(false) to mute.")})();const co=Object.freeze(Object.defineProperty({__proto__:null,HUD:ol,initHUD:Ju,notifyHUDUpdate:qe,onHUDUpdate:al,registerHUDCallback:Pa,updatePresetList:lo},Symbol.toStringTag,{value:"Module"}));console.log("🎛️ mandalaController.js loaded");const na={Major:[0,2,4,5,7,9,11],Minor:[0,2,3,5,7,8,10],Pentatonic:[0,2,4,7,9],Dorian:[0,2,3,5,7,9,10],Phrygian:[0,1,3,5,7,8,10],Lydian:[0,2,4,6,7,9,11],Mixolydian:[0,2,4,5,7,9,10],Aeolian:[0,2,3,5,7,8,10],Locrian:[0,1,3,5,6,8,10],Chromatic:[0,1,2,3,4,5,6,7,8,9,10,11]};class Mv{constructor(e,t={}){this.scene=e,this.rings=t.rings??3,this.symmetry=t.symmetry??6,this.scale=t.scale??"Major",this.mode=t.mode??"Ionian",this.emoji=t.emoji??"🍕",this.layoutMode=t.layoutMode??"radial",this.spiralOffset=t.spiralOffset??Math.PI/6,this.mandalaAudioReactive=t.mandalaAudioReactive??!0,this.mandalaSensitivity=t.mandalaSensitivity??1,this.radiusPulse=0,this.anglePulse=0,this.ringSpacing=t.ringSpacing??1,this.baseRadius=t.baseRadius??1,this.globalScale=t.globalScale??1,this.layout=t.layout??"Classic",this.rainbowMode=t.rainbowMode??!1,this.ringRadii=t.ringRadii??[0,2,4,6,8,10,12,14],this.ringRotationSpeeds=t.ringRotationSpeeds??[0,.01,.015,.02,.025,.03,.035,.04],this.ringRotations=Array(8).fill(0),this.audioModulation=t.audioModulation??!0,this.layeredAudio=t.layeredAudio??!0,this.differentialRotation=t.differentialRotation??!0,this.rotation=0,this.rotationSpeed=t.rotationSpeed??.02,this.musicalMode=t.musicalMode??!1,this.rootNote=t.rootNote??60,this.scaleSequenceEnabled=t.scaleSequenceEnabled??!1,this.scaleSequence=t.scaleSequence??["Major","Dorian","Mixolydian","Phrygian"],this.scaleSequenceIndex=0,this.scaleSequenceInterval=t.scaleSequenceInterval??4e3,this.lastScaleChange=performance.now(),this.performanceMode=t.performanceMode??!1,this.emojiLayout=t.emojiLayout??["🍕","🌶️","🍄"],this.customTexture=null,this.textureLoader=new ya,this.setupTextureListeners(),this.syncToState(),console.log(`🎛️ MandalaController initialized → rings=${this.rings} | symmetry=${this.symmetry} | scale=${this.scale} (${this.mode}) | layout=${this.layoutMode} | emoji=${this.emoji}`)}syncToState(){d.emojiMandala.rings=this.rings,d.emojiMandala.symmetry=this.symmetry,d.emojiMandala.scale=this.scale,d.emojiMandala.rotationSpeed=this.rotationSpeed,d.emojiMandala.rotation=this.rotation,d.emojiMandala.audioModulation=this.audioModulation,d.emojiMandala.layeredAudio=this.layeredAudio,d.emojiMandala.differentialRotation=this.differentialRotation,d.emojiMandala.ringRotationSpeeds=this.ringRotationSpeeds,d.emojiMandala.musicalMode=this.musicalMode,d.emojiMandala.rootNote=this.rootNote,d.emojiMandala.layout=this.emojiLayout,d.emojiMandala.scaleSequenceEnabled=this.scaleSequenceEnabled,d.emojiMandala.scaleSequence=this.scaleSequence,d.emojiMandala.scaleSequenceIndex=this.scaleSequenceIndex,d.emojiMandala.scaleSequenceInterval=this.scaleSequenceInterval,d.emojiMandala.lastScaleChange=this.lastScaleChange,d.emojiMandala.performanceMode=this.performanceMode,d.emojiMandala.layoutMode=this.layoutMode,d.emojiMandala.mandalaAudioReactive=this.mandalaAudioReactive,d.emojiMandala.mandalaSensitivity=this.mandalaSensitivity,d.emojiMandala.radiusPulse=this.radiusPulse,d.emojiMandala.anglePulse=this.anglePulse,d.emojiMandala.ringSpacing=this.ringSpacing,d.emojiMandala.baseRadius=this.baseRadius,d.emojiMandala.globalScale=this.globalScale,d.emojiMandala.layout=this.layout,d.emojiMandala.rainbowMode=this.rainbowMode}update(e=0){const t=(d==null?void 0:d.audio)||{bass:0,mid:0,treble:0,level:0},i=t.bass??0,s=t.mid??0,o=t.treble??0,a=e||t.level||0;if(this.mandalaAudioReactive&&d.audioReactive){const l=this.mandalaSensitivity;this.radiusPulse=a*l*.5,this.anglePulse=a*l*.02;const h=.5+a*l,f=.5+a*l*.5;Math.random()<.02&&console.log(`🔊 AudioLevel=${a.toFixed(2)} → rings expanded x${(1+this.radiusPulse).toFixed(2)}, symmetry pulse ${this.anglePulse.toFixed(3)}, emoji scale x${h.toFixed(2)}, glow=${f.toFixed(2)}`),d.emojiMandala.emojiScale=h,d.emojiMandala.glowIntensity=f}else this.radiusPulse=0,this.anglePulse=0,d.emojiMandala.emojiScale=1,d.emojiMandala.glowIntensity=1;const r=[];for(let l=0;l<this.rings;l++){const h=1-l/this.rings*.5;r.push(h)}if(d.emojiMandala.ringOpacities=r,this.rainbowMode){const l=[];for(let h=0;h<this.rings;h++){const f=h/this.rings*360;l.push(f)}d.emojiMandala.ringHues=l}else d.emojiMandala.ringHues=null;if(this.scaleSequenceEnabled&&this.scaleSequence&&this.scaleSequence.length>0){const l=performance.now();if(l-this.lastScaleChange>=this.scaleSequenceInterval){const h=(this.scaleSequenceIndex+1)%this.scaleSequence.length;this.scaleSequenceIndex=h,this.scale=this.scaleSequence[h],this.lastScaleChange=l,console.log(`🎛️ Scale sequence → ${this.scale}`),this.syncToState()}}if(this.differentialRotation)for(let l=0;l<this.rings;l++){const h=this.ringRotationSpeeds[l]||.01,f=this.audioModulation?l===0?i*.2:l<=2?s*.3:o*.5:0,m=h*(1+f);this.ringRotations[l]+=m}const c=this.rotationSpeed??.02,u=this.audioModulation?c*(1+a*2):c;this.rotation+=u,d.emojiMandala.rotation=this.rotation}setRings(e){const t=this.rings;for(this.rings=Math.max(1,Math.min(8,Math.floor(e)));this.emojiLayout.length<this.rings;){const i=["🍕","🌶️","🍄","🌟","💎","🔥","💧","🌈"];this.emojiLayout.push(i[this.emojiLayout.length%i.length])}this.syncToState(),console.log(`🎛️ Mandala update → rings=${this.rings} (was ${t}) | symmetry=${this.symmetry} | scale=${this.scale} (${this.mode}) | emoji=${this.emoji}`)}setSymmetry(e){const t=this.symmetry;this.symmetry=Math.max(2,Math.min(12,Math.floor(e))),this.syncToState(),console.log(`🎛️ Mandala update → rings=${this.rings} | symmetry=${this.symmetry} (was ${t}) | scale=${this.scale} (${this.mode}) | emoji=${this.emoji}`)}setScale(e,t=null){const i=this.scale,s=this.mode;if(na[e])this.scale=e,this.mode=t||e;else{console.warn(`🎛️ Invalid scale: ${e}, keeping current scale ${this.scale}`);return}this.musicalMode&&this.remapNotes(),this.syncToState(),console.log(`🎛️ Mandala update → rings=${this.rings} | symmetry=${this.symmetry} | scale=${this.scale} (${this.mode}) [was ${i} (${s})] | emoji=${this.emoji}`)}remapNotes(){const e=na[this.scale]||na.Major,t={};e.forEach((i,s)=>{const o=this.rootNote+i,a=s%this.emojiLayout.length;t[o]=this.emojiLayout[a]}),d.emojiMandala.noteToEmoji=t,console.log(`🎼 Notes remapped for ${this.scale} scale (root=${this.rootNote}):`,t)}swapEmoji(e,t=null){const i=this.emoji;if(t!==null&&t>=0&&t<this.rings){const s=this.emojiLayout[t];this.emojiLayout[t]=e,d.emojiMandala.layout=[...this.emojiLayout],console.log(`🎛️ Mandala update → Ring ${t} emoji: ${s} → ${e} | rings=${this.rings} | symmetry=${this.symmetry} | scale=${this.scale} (${this.mode})`)}else this.emoji=e,console.log(`🎛️ Mandala update → rings=${this.rings} | symmetry=${this.symmetry} | scale=${this.scale} (${this.mode}) | emoji=${e} (was ${i})`);this.syncToState()}setRotationSpeed(e){const t=this.rotationSpeed;this.rotationSpeed=Math.max(0,Math.min(.2,e)),this.syncToState(),console.log(`🎛️ Mandala rotation speed: ${this.rotationSpeed.toFixed(3)} (was ${t.toFixed(3)})`)}setLayout(e){if(!["radial","spiral","grid"].includes(e)){console.warn(`🎛️ Invalid layout mode: ${e}, keeping current mode ${this.layoutMode}`);return}const i=this.layoutMode;this.layoutMode=e,this.syncToState(),console.log(`${e==="spiral"?"🌀":e==="grid"?"🔲":"⭕"} Mandala layout set to ${e.charAt(0).toUpperCase()+e.slice(1)} (was ${i}) | rings=${this.rings} | symmetry=${this.symmetry}`)}setMusicalMode(e){this.musicalMode=e,e&&this.remapNotes(),this.syncToState(),console.log(`🎼 Musical mode: ${e?"ON":"OFF"} (scale=${this.scale}, root=${this.rootNote})`)}setRootNote(e){this.rootNote=Math.max(0,Math.min(127,Math.floor(e))),this.musicalMode&&this.remapNotes(),this.syncToState();const i=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][this.rootNote%12],s=Math.floor(this.rootNote/12)-1;console.log(`🎼 Root note: ${i}${s} (MIDI ${this.rootNote})`)}setAudioModulation(e){this.audioModulation=e,this.syncToState(),console.log(`🎛️ Audio modulation: ${e?"ON":"OFF"}`)}setLayeredAudio(e){this.layeredAudio=e,this.syncToState(),console.log(`🎛️ Layered audio: ${e?"ON (rings react to different bands)":"OFF"}`)}setDifferentialRotation(e){this.differentialRotation=e,this.syncToState(),console.log(`🎛️ Differential rotation: ${e?"ON (each ring independent)":"OFF (unified)"}`)}setScaleSequencing(e){this.scaleSequenceEnabled=e,e&&(this.lastScaleChange=performance.now()),this.syncToState(),console.log(`🎛️ Scale sequencing: ${e?"ON":"OFF"} (${this.scaleSequence.join(" → ")})`)}setScaleSequence(e){this.scaleSequence=e.filter(t=>na[t]),this.syncToState(),console.log(`🎛️ Scale sequence updated: ${this.scaleSequence.join(" → ")}`)}setPerformanceMode(e){this.performanceMode=e,this.syncToState(),console.log(`🎛️ Performance mode: ${e?"ON":"OFF"}`)}setMandalaAudioReactive(e){this.mandalaAudioReactive=e,this.syncToState(),console.log(`🎵 Mandala audio-reactive ${e?"ON":"OFF"} (sensitivity=${this.mandalaSensitivity.toFixed(2)})`)}setMandalaSensitivity(e){const t=this.mandalaSensitivity;this.mandalaSensitivity=Math.max(0,Math.min(2,e)),this.syncToState(),console.log(`🎵 Mandala sensitivity: ${(this.mandalaSensitivity*100).toFixed(0)}% (was ${(t*100).toFixed(0)}%)`)}applyClassic(){this.layout="Classic",this.ringSpacing=1,this.baseRadius=1,this.symmetry=6,this.syncToState(),console.log(`🎨 Mandala layout set → Classic (rings=${this.rings} | symmetry=${this.symmetry})`)}applyFlower(){this.layout="Flower",this.ringSpacing=.8,this.baseRadius=1.2,this.symmetry=8,this.ringRadii=[0,1.5,2.5,3.5,4.5,5.5,6.5,7.5],this.syncToState(),console.log(`🎨 Mandala layout set → Flower (rings=${this.rings} | symmetry=${this.symmetry})`)}applySpiral(){this.layout="Spiral",this.ringSpacing=1,this.baseRadius=1,this.spiralOffset=Math.PI*137.5/180,this.syncToState(),console.log(`🎨 Mandala layout set → Spiral (rings=${this.rings} | symmetry=${this.symmetry})`)}applyDense(){this.layout="Dense",this.ringSpacing=.5,this.baseRadius=.8,this.rings=Math.min(this.rings*2,8),this.symmetry=12,this.syncToState(),console.log(`🎨 Mandala layout set → Dense (rings=${this.rings} | symmetry=${this.symmetry})`)}setRingSpacing(e){const t=this.ringSpacing;this.ringSpacing=Math.max(.2,Math.min(2,e)),this.syncToState(),console.log(`🎨 Ring spacing: ${this.ringSpacing.toFixed(2)} (was ${t.toFixed(2)})`)}setBaseRadius(e){const t=this.baseRadius;this.baseRadius=Math.max(.5,Math.min(3,e)),this.syncToState(),console.log(`🎨 Base radius: ${this.baseRadius.toFixed(2)} (was ${t.toFixed(2)})`)}setGlobalScale(e){const t=this.globalScale;this.globalScale=Math.max(.5,Math.min(2,e)),this.syncToState(),console.log(`🎨 Global scale: ${this.globalScale.toFixed(2)} (was ${t.toFixed(2)})`)}setRainbowMode(e){this.rainbowMode=e,this.syncToState(),console.log(`🌈 Mandala rainbow mode: ${e?"ON":"OFF"}`)}setupTextureListeners(){window.addEventListener("mandala:imageSelected",e=>{const{url:t}=e.detail;this.loadCustomTexture(t)}),window.addEventListener("mandala:imageCleared",()=>{this.clearCustomTexture()})}loadCustomTexture(e){this.textureLoader.load(e,t=>{this.customTexture&&this.customTexture.dispose(),this.customTexture=t,console.log("🖼️ MandalaController: Custom texture loaded")},void 0,t=>{console.error("🖼️ MandalaController: Failed to load texture:",t)})}clearCustomTexture(){this.customTexture&&(this.customTexture.dispose(),this.customTexture=null),console.log("🖼️ MandalaController: Custom texture cleared, using emoji")}getActiveTexture(){return d.mandala.useCustomImage&&this.customTexture?this.customTexture:null}setCustomImage(e,t=null){d.mandala.useCustomImage=!0,d.mandala.customImage=e,d.mandala.customImageName=t,this.syncToState(),console.log(`🖼️ Mandala custom image set${t?`: ${t}`:""} (exclusive mode ON)`)}clearCustomImage(){d.mandala.useCustomImage=!1,d.mandala.customImage=null,d.mandala.customImageName=null,this.syncToState(),console.log("🖼️ Mandala custom image cleared, restored to emoji texture")}getState(){return{rings:this.rings,symmetry:this.symmetry,scale:this.scale,mode:this.mode,emoji:this.emoji,emojiLayout:[...this.emojiLayout],rotation:this.rotation,rotationSpeed:this.rotationSpeed,audioModulation:this.audioModulation,layeredAudio:this.layeredAudio,differentialRotation:this.differentialRotation,musicalMode:this.musicalMode,rootNote:this.rootNote,scaleSequenceEnabled:this.scaleSequenceEnabled,scaleSequence:[...this.scaleSequence],performanceMode:this.performanceMode,layoutMode:this.layoutMode,spiralOffset:this.spiralOffset}}destroy(){console.log("🎛️ MandalaController destroyed")}}console.log("🎛️ MandalaController class ready");console.log("📡 telemetry.js loaded");let cn=null,As=null,Rs=null,Ps=null,mi=null,gi=null,xi=null,Ls=null,ad=performance.now(),aa=0,ia=0;function bv(n){wv(),Ev(n),console.log("📡 Telemetry initialized")}function wv(){cn=document.createElement("div"),cn.id="telemetry-overlay",cn.style.cssText=`
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 12px;
    z-index: 1000;
    min-width: 140px;
    line-height: 1.4;
  `;const n=document.createElement("div");n.textContent="📡 Telemetry",n.style.cssText="color: #00ff00; margin-bottom: 8px; font-weight: bold;",cn.appendChild(n),As=document.createElement("div"),As.textContent="FPS: --",cn.appendChild(As),Rs=document.createElement("div"),Rs.textContent="MIDI: -- devices",cn.appendChild(Rs),Ps=document.createElement("div"),Ps.textContent="Idle: --",cn.appendChild(Ps),mi=document.createElement("div"),mi.textContent="Morph: -- (0.0)",cn.appendChild(mi),gi=document.createElement("div"),gi.textContent="Preset: --",cn.appendChild(gi),xi=document.createElement("div"),xi.textContent="Audio: OFF",cn.appendChild(xi),Ls=document.createElement("div"),Ls.textContent="Visual: --",cn.appendChild(Ls),document.body.appendChild(cn)}function Ev(n){function e(){const t=performance.now(),i=t-ad;if(ia++,ia>=30&&(aa=Math.round(1e3/(i/ia)),ia=0),n)try{const s=n();Cv(s)}catch(s){console.warn("📡 Telemetry getState error:",s)}ad=t,requestAnimationFrame(e)}e()}function Cv(n){if(As&&(As.textContent=`FPS: ${aa}`,As.style.color=aa>=60?"#00ff00":aa>=30?"#ffff00":"#ff6666"),Rs&&n.midiDevices!==void 0&&(Rs.textContent=`MIDI: ${n.midiDevices} devices`,Rs.style.color=n.midiDevices>0?"#00ff00":"#888888"),Ps&&n.hudIdle!==void 0&&(Ps.textContent=`Idle: ${n.hudIdle?"ON":"OFF"}`,Ps.style.color=n.hudIdle?"#00ff00":"#ff6666"),mi&&n.morphState!==void 0){const{weights:e,isTransitioning:t}=n.morphState,i=t?"⚡":"🌀";if(e){const s=Object.entries(e).filter(([o,a])=>a>.01).map(([o,a])=>`${o.charAt(0).toUpperCase()}${(a*100).toFixed(0)}%`).join(" | ");mi.textContent=`${i} ${s||"None"}`,mi.style.color=s?"#ffff00":"#888888"}else mi.textContent=`${i} Legacy mode`,mi.style.color="#888888"}if(gi&&n.currentPreset!==void 0&&(n.currentPreset?(gi.textContent=`💾 ${n.currentPreset}`,gi.style.color="#00ffff"):(gi.textContent="💾 None",gi.style.color="#888888")),xi&&n.audioData!==void 0)if(n.audioData.isEnabled){const e=(n.audioData.bass*100).toFixed(0),t=(n.audioData.mid*100).toFixed(0),i=(n.audioData.treble*100).toFixed(0);xi.textContent=`🎶 B${e}% M${t}% T${i}%`,xi.style.color="#ff9900"}else xi.textContent="🎶 OFF",xi.style.color="#888888";if(Ls&&n.visualData!==void 0){const e=n.visualData.ambientIntensity.toFixed(1),t=n.visualData.directionalIntensity.toFixed(1),i=n.visualData.color;Ls.textContent=`🎨 A${e} D${t} ${i}`,Ls.style.color="#ff66ff"}}console.log("🎹 midiRouter.js loaded");const Tv=function(){function n({cc:t,channel:i=0,path:s,min:o,max:a}){return`// CC${t} → ${s} (${o}..${a})
{ cc: ${t}, ch: ${i}, apply: (value01) => {
  const v = ${o} + (${a} - ${o}) * value01;
  // Example HUD update; replace with your central binding call if different:
  window.onHUDUpdate?.({ "${s}": v });
}}`}function e({cc:t,value:i,channel:s=0}){const o=window.MidiLearn;if(!(o!=null&&o.active)||!(o!=null&&o.target))return;const{path:a,min:r=0,max:c=1,label:u=a}=o.target;console.log(`✅ MIDI Learn: CC${t} captured for "${u}" → path="${a}", range=[${r}, ${c}]`),console.log(`📋 Paste this into your mapping (e.g., controlBindings):
`+n({cc:t,channel:s,path:a,min:r,max:c}));try{const l=JSON.parse(localStorage.getItem("midiLearnSuggestions")||"[]");l.push({ts:Date.now(),cc:t,channel:s,path:a,min:r,max:c,label:u}),localStorage.setItem("midiLearnSuggestions",JSON.stringify(l))}catch{}o.setActive(!1)}return{handleCC:e}}();let at;setTimeout(()=>{Pe(()=>Promise.resolve().then(()=>ki),void 0,import.meta.url).then(n=>{at=n.getMandalaController})},0);window.emojiParticlesMIDI={cycleCC:30,advanceStoryCC:31};window.emojiBankMIDI={startCC:40,endCC:47};ly(({cc:n,value:e,device:t,channel:i=0})=>{var s,o,a,r,c,u;if(console.log(`🎹 CC${n} from ${t}: ${e}`),Tv.handleCC({cc:n,value:e,channel:i}),(s=d.emojiMandala)!=null&&s.enabled){const l=at==null?void 0:at();if(n===20){const h=Math.floor(3+e/127*21);l?l.setSymmetry(h):(d.emojiMandala.symmetry=Math.min(24,h),console.log(`🎹 [MIDI] CC20 → Mandala Symmetry = ${d.emojiMandala.symmetry}`));return}else if(n===21){const h=Math.floor(1+e/127*11);l?l.setRings(h):(d.emojiMandala.rings=Math.min(12,h),console.log(`🎹 [MIDI] CC21 → Mandala Rings = ${d.emojiMandala.rings}`));return}else if(n===22){let h;if(e<43?h="radial":e<86?h="spiral":h="grid",l)l.setLayout(h);else{d.emojiMandala.layoutMode=h;const f=h==="spiral"?"🌀":h==="grid"?"🔲":"⭕";console.log(`🎹 [MIDI] CC22 → Mandala Layout = ${h.charAt(0).toUpperCase()+h.slice(1)} ${f}`)}return}else if(n===23){let h;e<32?h="🍕":e<64?h="🌶️":e<96?h="🍄":h="⭐",l?l.swapEmoji(h):(d.emojiMandala.layout[0]=h,console.log(`🎹 [MIDI] CC23 → Mandala Emoji = ${h}`));return}else if(n===24){const h=e/127*2;l?l.setMandalaSensitivity(h):(d.emojiMandala.mandalaSensitivity=h,console.log(`🎹 [MIDI] CC24 → Mandala Sensitivity = ${h.toFixed(1)}`));return}}if(!Tu(n,e)){if(n===1)if((o=d.emojiMandala)!=null&&o.enabled){const l=e/127*.1,h=at==null?void 0:at();h?h.setRotationSpeed(l):(d.emojiMandala.rotationSpeed=l,console.log(`🎛️ Mandala rotation speed: ${l.toFixed(3)}`))}else d.rotationX=e/127*.1;else if(n===2)if((a=d.emojiMandala)!=null&&a.enabled){const l=Math.floor(2+e/127*10),h=at==null?void 0:at();h?h.setSymmetry(l):(d.emojiMandala.symmetry=Math.min(12,l),console.log(`🎛️ Mandala symmetry: ${d.emojiMandala.symmetry}-fold`))}else{const l=e/127,h=d.morphState.targets,f=h.indexOf(d.morphState.current),m=(f+1)%h.length,x=h[f],y=h[m];h.forEach(g=>{d.morphWeights[g]=0}),d.morphWeights[x]=1-l,d.morphWeights[y]=l,d.morphBaseWeights=[0,0,0,0],d.morphBaseWeights[f]=1-l,d.morphBaseWeights[m]=l,console.log(`🎹 CC2: Morph blend ${x}→${y} (${(l*100).toFixed(0)}%)`)}else if(n===3)if((r=d.emojiMandala)!=null&&r.enabled){const l=Math.floor(1+e/127*7),h=at==null?void 0:at();h?h.setRings(l):(d.emojiMandala.rings=Math.min(8,l),console.log(`🎛️ Mandala rings: ${d.emojiMandala.rings}`))}else{const l=["cube","sphere","pyramid","torus"];let h;e<32?h=0:e<64?h=1:e<96?h=2:h=3;const f=l[h];d.morphState.previous=d.morphState.current,d.morphState.current=f,l.forEach(x=>{d.morphWeights[x]=0}),d.morphWeights[f]=1;const m=["sphere","cube","pyramid","torus"].indexOf(f);d.morphBaseWeights=[0,0,0,0],m>=0&&(d.morphBaseWeights[m]=1),console.log(`🎹 CC3: Morph target → ${f}`)}else if(n===4)d.rotationY=e/127*.1;else if(n===5){if((c=d.emojiMandala)!=null&&c.enabled){const l=at==null?void 0:at(),h=e/127*2;l?l.setMandalaSensitivity(h):(d.emojiMandala.mandalaSensitivity=h,console.log(`🎵 Mandala sensitivity: ${(h*100).toFixed(0)}%`))}}else if(n===6){if((u=d.emojiMandala)!=null&&u.enabled){const l=at==null?void 0:at(),h=e>63;l?l.setMandalaAudioReactive(h):(d.emojiMandala.mandalaAudioReactive=h,console.log(`🎵 Mandala audio-reactive ${h?"ON":"OFF"}`))}}else if(n===7)d.vessel.opacity=e/127;else if(n===8)e>64&&Pe(async()=>{const{cycleLayout:l}=await Promise.resolve().then(()=>_a);return{cycleLayout:l}},void 0,import.meta.url).then(({cycleLayout:l})=>{Pe(async()=>{const{scene:h}=await Promise.resolve().then(()=>Gi);return{scene:h}},void 0,import.meta.url).then(({scene:h})=>{l(h)})});else if(n===10)console.log("🎹 CC10 fallback: sphere weight (should be handled by binding system)");else if(n===21){const l=e/127*360;qr(l),console.log("🎹 CC21 fallback: hue shift (binding system also active)")}else if(n===22)console.log("🎹 CC22 fallback: pyramid weight (should be handled by binding system)");else if(n===23)console.log("🎹 CC23 fallback: torus weight (should be handled by binding system)");else if(n===24)d.scale=.5+e/127*1.5;else if(n===window.emojiParticlesMIDI.cycleCC)window.emojiParticles&&e>0&&window.emojiParticles.cycleEmoji();else if(n===window.emojiParticlesMIDI.advanceStoryCC)window.emojiParticles&&e>0&&window.emojiParticles.advanceStory();else if(n===40){const l=e>0;d.mandala.enabled=l,d.emojiMandala.enabled=l,console.log(`🎛️ MIDI → Mandala: ${l?"ON":"OFF"}`)}else if(n===41){const l=Math.floor(3+e/127*9);d.mandala.ringCount=l,d.emojiMandala.rings=l;const h=at==null?void 0:at();h&&h.setRings(l),console.log(`🎛️ MIDI → Mandala rings: ${l}`)}else if(n===42){const l=Math.floor(2+e/127*10);d.mandala.symmetry=l,d.emojiMandala.symmetry=l;const h=at==null?void 0:at();h&&h.setSymmetry(l),console.log(`🎛️ MIDI → Mandala symmetry: ${l}`)}else if(n>=window.emojiBankMIDI.startCC&&n<=window.emojiBankMIDI.endCC&&e>0&&window.emojiBankManager){const l=n-window.emojiBankMIDI.startCC;window.emojiBankManager.loadBank(l)&&(d.currentBank=l,window.rebuildEmojiMixerUI&&window.rebuildEmojiMixerUI(),window.rebuildSequencerGrid&&window.rebuildSequencerGrid(),window.updateBankButtonStates&&window.updateBankButtonStates(),console.log(`🎹 MIDI pad ${n} → Bank ${l+1} loaded`))}}});cy(({note:n,velocity:e,noteOn:t,device:i})=>{var s;if(console.log(`🎹 Note ${t?"ON":"OFF"} ${n} from ${i}: velocity=${e}`),(s=d.emojiMandala)!=null&&s.enabled&&t&&e>0){const o=at==null?void 0:at(),{layout:a,rings:r}=d.emojiMandala;if(n>=36&&n<=43){const c=n-36;if(c<r&&c<a.length){const u=["🍕","🌶️","🍄","🌟","💎","🔥","💧","🌈"],l=a[c],f=(u.indexOf(l)+1)%u.length,m=u[f];o?o.swapEmoji(m,c):(d.emojiMandala.layout[c]=m,console.log(`🎛️ Ring ${c} emoji swap: ${l} → ${m}`))}}d.emojiMandala.musicalMode&&(t&&e>0?(d.emojiMandala.activeNotes.add(n),d.emojiMandala.notePulse[n]=e/127):(d.emojiMandala.activeNotes.delete(n),d.emojiMandala.notePulse[n]=0))}});dy(({value:n,rawValue:e,device:t})=>{var i;if(console.log(`🎹 Pitch bend from ${t}: ${n.toFixed(3)} (raw=${e})`),(i=d.emojiMandala)!=null&&i.enabled){const s=at==null?void 0:at(),o=1+n,a=d.emojiMandala.rotationSpeed||.02,r=Math.max(0,Math.min(.2,a*o));s?(s.setRotationSpeed(r),console.log(`🎛️ Mandala wheel spin: ${o.toFixed(2)}x`)):(d.emojiMandala.rotationSpeed=r,console.log(`🎛️ Mandala wheel spin: ${o.toFixed(2)}x (speed=${r.toFixed(3)})`))}});console.log("🎹 MIDI routing configured (Phase 11.7.32: Mandala MIDI integration)");console.log("🔗 Mandala MIDI bindings: CC40=ON/OFF | CC41=Rings | CC42=Symmetry");console.log("📟 hudRouter.js loaded");let Pn;setTimeout(()=>{Pe(()=>Promise.resolve().then(()=>ki),void 0,import.meta.url).then(n=>{Pn=n.getMandalaController})},0);al(n=>{var e;if(n.type==="app:reset"){console.log("📟 HUD action: app:reset");return}if(n.idleSpin!==void 0&&(d.idleSpin=n.idleSpin),n.rotX!==void 0&&(d.rotationX=n.rotX),n.rotY!==void 0&&(d.rotationY=n.rotY),n.scale!==void 0&&(d.scale=n.scale),n.morphTarget!==void 0){d.morphState.previous=d.morphState.current,d.morphState.current=n.morphTarget,d.morphState.targets.forEach(i=>{d.morphWeights[i]=0}),d.morphWeights[n.morphTarget]=1;const t=["sphere","cube","pyramid","torus"].indexOf(n.morphTarget);d.morphBaseWeights=[0,0,0,0],t>=0&&(d.morphBaseWeights[t]=1)}if(n.morphBlend!==void 0){const t=d.morphState.targets,i=t.indexOf(d.morphState.current),s=(i+1)%t.length,o=t[i],a=t[s];t.forEach(r=>{d.morphWeights[r]=0}),d.morphWeights[o]=1-n.morphBlend,d.morphWeights[a]=n.morphBlend,d.morphBaseWeights=[0,0,0,0],d.morphBaseWeights[i]=1-n.morphBlend,d.morphBaseWeights[s]=n.morphBlend}if(n.targetWeight!==void 0){const{target:t,weight:i}=n.targetWeight;$d(t,i)}if(n.audioEnabled!==void 0&&(d.audio.enabled=n.audioEnabled,d.audioReactive=n.audioEnabled,console.log(`🎵 Audio Reactive: ${n.audioEnabled}`),n.audioEnabled?(console.log("🔍 Phase 13.1a: Calling enableAudio() from hudRouter"),Pe(async()=>{const{enableAudio:t}=await Promise.resolve().then(()=>Iy);return{enableAudio:t}},void 0,import.meta.url).then(({enableAudio:t})=>{console.log("🔍 Phase 13.1a: audio.js imported, invoking enableAudio()"),t()})):(d.audio.bass=0,d.audio.mid=0,d.audio.treble=0)),n.audioSensitivity!==void 0&&(d.audio.sensitivity=n.audioSensitivity),n.audioGain!==void 0&&(d.audio.audioGain=Number(n.audioGain)||1),n.ambientIntensity!==void 0&&(d.lighting.ambientIntensity=n.ambientIntensity),n.directionalIntensity!==void 0&&(d.lighting.directionalIntensity=n.directionalIntensity),n.directionalAngleX!==void 0&&(d.lighting.directionalAngleX=n.directionalAngleX),n.directionalAngleY!==void 0&&(d.lighting.directionalAngleY=n.directionalAngleY),n.color!==void 0&&($r(n.color),d.vessel.color=n.color,console.log(`🎨 Color updated: ${n.color} (vessel + particles)`)),n.particlesEnabled!==void 0&&(d.particlesEnabled=n.particlesEnabled,n.particlesEnabled?(mo(ft,d.particlesCount),console.log(`✨ Particles enabled (count: ${d.particlesCount})`)):(va(ft),console.log("✨ Particles disabled"))),n.particlesCount!==void 0&&(d.particlesCount=n.particlesCount,d.particles.count=n.particlesCount,d.particlesEnabled)){const t=d.particles.size||.5,i=d.particles.audioGain||2;va(ft),mo(ft,d.particlesCount),Pe(async()=>{const{getParticleSystemInstance:s}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:s}},void 0,import.meta.url).then(({getParticleSystemInstance:s})=>{const o=s();o&&(o.setParticleSize(t),o.setAudioGain(i))}),console.log(`✨ Particle count updated: ${d.particlesCount}`)}if(n.particlesLayout!==void 0&&(d.particles.layout=n.particlesLayout,console.log(`✨ Particles layout: ${n.particlesLayout}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setLayout(n.particlesLayout)})),n.particlesHue!==void 0&&(d.particles.hue=n.particlesHue,console.log(`✨ Hue shift: ${n.particlesHue}°`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setHueShift(n.particlesHue)})),n.particlesSize!==void 0&&(d.particles.size=n.particlesSize,console.log(`✨ Particle size updated: ${n.particlesSize.toFixed(2)} world units`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setParticleSize(n.particlesSize)})),n.particlesOpacity!==void 0&&(d.particles.opacity=n.particlesOpacity,console.log(`✨ Opacity: ${n.particlesOpacity.toFixed(2)}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setOpacity(n.particlesOpacity)})),n.particlesOrganicMotion!==void 0&&(d.particles.organicMotion=n.particlesOrganicMotion,console.log(`✨ Organic motion: ${n.particlesOrganicMotion}`)),n.particlesOrganicStrength!==void 0&&(d.particles.organicStrength=n.particlesOrganicStrength,console.log(`✨ Organic strength: ${n.particlesOrganicStrength.toFixed(2)}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setOrganicStrength(n.particlesOrganicStrength)})),n.particlesAudioReactiveHue!==void 0&&(d.particles.audioReactiveHue=n.particlesAudioReactiveHue,console.log(`✨ Audio-reactive hue: ${n.particlesAudioReactiveHue}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setAudioReactive(n.particlesAudioReactiveHue)})),n.particlesAudioGain!==void 0&&(d.particles.audioGain=n.particlesAudioGain,console.log(`✨ Audio gain: ${n.particlesAudioGain.toFixed(1)}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setAudioGain(n.particlesAudioGain)})),n.particlesVelocity!==void 0&&(d.particles.velocity=n.particlesVelocity,d.particles.orbitalSpeed=n.particlesVelocity,console.log(`✨ Orbital speed: ${n.particlesVelocity.toFixed(2)}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setOrbitalSpeed(n.particlesVelocity)})),n.particlesMotionSmoothness!==void 0&&(d.particles.motionSmoothness=n.particlesMotionSmoothness,console.log(`✨ Smoothness: ${n.particlesMotionSmoothness.toFixed(2)}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setSmoothness(n.particlesMotionSmoothness)})),n.particlesTrailEnabled!==void 0&&(d.particles.trailEnabled=n.particlesTrailEnabled,console.log(`🌊 Trail enabled: ${n.particlesTrailEnabled}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setTrailEnabled(n.particlesTrailEnabled)})),n.particlesTrailLength!==void 0&&(d.particles.trailLength=n.particlesTrailLength,console.log(`🌊 Trail length: ${n.particlesTrailLength}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setTrailLength(n.particlesTrailLength)})),n.particlesTrailOpacity!==void 0&&(d.particles.trailOpacity=n.particlesTrailOpacity,console.log(`🌊 Trail opacity: ${n.particlesTrailOpacity.toFixed(2)}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setTrailOpacity(n.particlesTrailOpacity)})),n.particlesTrailFade!==void 0&&(d.particles.trailFade=n.particlesTrailFade,console.log(`🌊 Trail fade: ${n.particlesTrailFade.toFixed(2)}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setTrailFade(n.particlesTrailFade)})),n.particlesTrailAudioReactive!==void 0&&(d.particles.trailAudioReactive=n.particlesTrailAudioReactive,console.log(`🌊 Trail audio-reactive length: ${n.particlesTrailAudioReactive}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setTrailAudioReactive(n.particlesTrailAudioReactive)})),n.particlesTrailLengthMin!==void 0&&(d.particles.trailLengthMin=n.particlesTrailLengthMin,console.log(`🌊 Trail min length: ${n.particlesTrailLengthMin}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setTrailLengthMin(n.particlesTrailLengthMin)})),n.particlesTrailLengthMax!==void 0&&(d.particles.trailLengthMax=n.particlesTrailLengthMax,console.log(`🌊 Trail max length: ${n.particlesTrailLengthMax}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setTrailLengthMax(n.particlesTrailLengthMax)})),n.particlesResetDefaults!==void 0&&(console.log("🔄 Resetting particle system to defaults"),d.particles.size=.5,d.particles.count=5e3,d.particles.orbitalSpeed=.05,d.particles.motionSmoothness=.5,d.particles.opacity=1,d.particles.organicStrength=.2,d.particles.hue=0,d.particles.audioReactiveHue=!0,d.particles.audioGain=2,d.particles.layout="orbit",Pe(async()=>{const{destroyParticles:t,initParticles:i,getParticleSystemInstance:s}=await Promise.resolve().then(()=>Mt);return{destroyParticles:t,initParticles:i,getParticleSystemInstance:s}},void 0,import.meta.url).then(({destroyParticles:t,initParticles:i,getParticleSystemInstance:s})=>{t(ft),i(ft,5e3);const o=s();o&&(o.setParticleSize(.5),o.setAudioGain(2),o.setHueShift(0),o.setAudioReactive(!0),o.setOrbitalSpeed(.05),o.setSmoothness(.5),o.setOpacity(1),o.setOrganicStrength(.2),o.setLayout("orbit"))})),n.motionTrailsEnabled!==void 0&&(d.motionTrailsEnabled=n.motionTrailsEnabled,console.log(`🎞️ Motion Trails ${n.motionTrailsEnabled?"ON":"OFF"}`)),n.motionTrailIntensity!==void 0&&(d.motionTrailIntensity=n.motionTrailIntensity,console.log(`🎞️ Motion Trail Intensity: ${n.motionTrailIntensity.toFixed(2)}`)),n.shadowBoxProjectParticles!==void 0&&(console.log(`📦 Shadow Box project particles: ${n.shadowBoxProjectParticles}`),Pe(async()=>{const{getParticleSystemInstance:t}=await Promise.resolve().then(()=>Mt);return{getParticleSystemInstance:t}},void 0,import.meta.url).then(({getParticleSystemInstance:t})=>{const i=t();i&&i.setProjectParticlesToShadow(n.shadowBoxProjectParticles)})),n.shadowBoxThreshold!==void 0&&(console.log(`📦 Shadow Box threshold: ${n.shadowBoxThreshold.toFixed(2)}`),Pe(async()=>{const{getShadowBox:t}=await Promise.resolve().then(()=>ki);return{getShadowBox:t}},void 0,import.meta.url).then(({getShadowBox:t})=>{const i=t();i&&i.setThreshold(n.shadowBoxThreshold)})),n.shadowBoxBleachGain!==void 0&&(console.log(`📦 Shadow Box bleach gain: ${n.shadowBoxBleachGain.toFixed(2)}`),Pe(async()=>{const{getShadowBox:t}=await Promise.resolve().then(()=>ki);return{getShadowBox:t}},void 0,import.meta.url).then(({getShadowBox:t})=>{const i=t();i&&i.setGain(n.shadowBoxBleachGain)})),n.shadowBoxPalette!==void 0&&Pe(async()=>{const{getShadowBox:t}=await Promise.resolve().then(()=>ki);return{getShadowBox:t}},void 0,import.meta.url).then(({getShadowBox:t})=>{const i=t();i&&Pe(async()=>{const{state:s}=await Promise.resolve().then(()=>Wc);return{state:s}},void 0,import.meta.url).then(({state:s})=>{if(s.shadowBox.palette=n.shadowBoxPalette,n.shadowBoxPalette==="Manual"){const o=s.shadowBox.bgColor||"#000000",a=s.shadowBox.fgColor||"#ffffff";i.setColors(o,a)}else i.setPalette(n.shadowBoxPalette)})}),(n.shadowBoxBgColor!==void 0||n.shadowBoxFgColor!==void 0)&&Pe(async()=>{const{getShadowBox:t}=await Promise.resolve().then(()=>ki);return{getShadowBox:t}},void 0,import.meta.url).then(({getShadowBox:t})=>{const i=t();i&&Pe(async()=>{const{state:s}=await Promise.resolve().then(()=>Wc);return{state:s}},void 0,import.meta.url).then(({state:s})=>{const o=n.shadowBoxBgColor||s.shadowBox.bgColor||"#000000",a=n.shadowBoxFgColor||s.shadowBox.fgColor||"#ffffff";s.shadowBox||(s.shadowBox={}),n.shadowBoxBgColor&&(s.shadowBox.bgColor=o),n.shadowBoxFgColor&&(s.shadowBox.fgColor=a),(!s.shadowBox.palette||s.shadowBox.palette==="Manual")&&i.setColors(o,a)})}),n.shadowBoxGain!==void 0&&(console.log(`📦 Shadow Box gain (legacy): ${n.shadowBoxGain.toFixed(2)}`),Pe(async()=>{const{getShadowBox:t}=await Promise.resolve().then(()=>ki);return{getShadowBox:t}},void 0,import.meta.url).then(({getShadowBox:t})=>{const i=t();i&&i.setShadowGain(n.shadowBoxGain)})),n.vesselEnabled!==void 0&&(d.vessel.enabled=n.vesselEnabled,console.log(`🚢 Vessel enabled: ${n.vesselEnabled}`)),n.vesselOpacity!==void 0&&(d.vessel.opacity=n.vesselOpacity,console.log(`🚢 Vessel opacity: ${n.vesselOpacity}`)),n.vesselScale!==void 0&&(d.vessel.scale=n.vesselScale,console.log(`🚢 Vessel scale: ${n.vesselScale}`)),n.vesselColor!==void 0&&(d.vessel.color=n.vesselColor,console.log(`🚢 Vessel color: ${n.vesselColor}`)),n.vesselSpinEnabled!==void 0&&(d.vessel.spinEnabled=n.vesselSpinEnabled,console.log(`🚢 Vessel spin enabled: ${n.vesselSpinEnabled}`)),n.vesselSpinSpeed!==void 0&&(d.vessel.spinSpeed=n.vesselSpinSpeed,console.log(`🚢 Vessel spin speed: ${n.vesselSpinSpeed}`)),n.vesselMode!==void 0&&(d.vessel.mode=n.vesselMode,console.log(`🚢 Vessel mode: ${n.vesselMode}`)),n.vesselVisible!==void 0&&(d.vessel.visible=n.vesselVisible,console.log(`🧭 Compass rings visible: ${n.vesselVisible}`),Pe(async()=>{const{reinitVessel:t}=await Promise.resolve().then(()=>_a);return{reinitVessel:t}},void 0,import.meta.url).then(({reinitVessel:t})=>{t(ft,En,qt)})),n.vesselLayout!==void 0){d.vessel.layout=n.vesselLayout;const t=["lattice","hoops","shells"];d.vessel.layoutIndex=t.indexOf(n.vesselLayout),console.log(`🚢 Vessel layout: ${n.vesselLayout} (index: ${d.vessel.layoutIndex})`),d.vessel.mode==="gyre"&&Pe(async()=>{const{reinitVessel:i}=await Promise.resolve().then(()=>_a);return{reinitVessel:i}},void 0,import.meta.url).then(({reinitVessel:i})=>{i(ft,En,qt)})}if(n.vesselAudioSmoothing!==void 0&&(d.vessel.audioSmoothing=n.vesselAudioSmoothing,console.log(`🚢 Vessel audio smoothing: ${n.vesselAudioSmoothing}`)),n.vesselHueShiftRange!==void 0&&(d.vessel.hueShiftRange=n.vesselHueShiftRange,console.log(`🚢 Vessel hue shift range: ${n.vesselHueShiftRange}°`)),n.shadowsEnabled!==void 0&&(d.shadows.enabled=n.shadowsEnabled,console.log(`🌑 Shadows enabled: ${n.shadowsEnabled}`)),n.shadowsGround!==void 0&&(d.shadows.ground=n.shadowsGround,console.log(`🌑 Ground shadow: ${n.shadowsGround}`)),n.shadowsBackdrop!==void 0&&(d.shadows.backdrop=n.shadowsBackdrop,console.log(`🌑 Backdrop shadow: ${n.shadowsBackdrop}`)),n.shadowsOpacity!==void 0&&(d.shadows.opacity=n.shadowsOpacity,console.log(`🌑 Shadow opacity: ${n.shadowsOpacity}`)),n.shadowsColor!==void 0&&(d.shadows.color=n.shadowsColor,console.log(`🌑 Shadow color: ${n.shadowsColor}`)),n.spritesEnabled!==void 0&&(d.sprites.enabled=n.spritesEnabled,console.log(`✨ Sprites enabled: ${n.spritesEnabled}`)),n.spritesCount!==void 0&&(d.sprites.count=n.spritesCount,console.log(`✨ Sprites count: ${n.spritesCount}`),Pe(async()=>{const{reinitSprites:t}=await Promise.resolve().then(()=>Cy);return{reinitSprites:t}},void 0,import.meta.url).then(({reinitSprites:t})=>{Pe(async()=>{const{scene:i}=await Promise.resolve().then(()=>Gi);return{scene:i}},void 0,import.meta.url).then(({scene:i})=>{t(i)})})),n.colorLayer!==void 0){const{colorLayer:t,property:i,value:s}=n,o=i;Pe(async()=>{const{applyBinding:a}=await Promise.resolve().then(()=>Zy);return{applyBinding:a}},void 0,import.meta.url).then(({applyBinding:a})=>{a(t,o,s,"HUD")})}if(n.presetAction!==void 0)if(n.presetAction==="chain:start"){const t=n.chainLoop?" [LOOP]":"",i=n.chainShuffle?" [SHUFFLE]":"";console.log(`📟 Chain action: start${t}${i}`,n.chainPresets,`(${n.chainDuration}ms)`)}else n.presetAction==="chain:stop"?console.log("📟 Chain action: stop"):n.presetAction==="chain:save"?console.log("📟 Chain action: save",n.chainName,`(${((e=n.chainPresets)==null?void 0:e.length)||0} presets)`):n.presetAction==="chain:load"?console.log("📟 Chain action: load",n.chainName):n.presetAction==="chain:delete"?console.log("📟 Chain action: delete",n.chainName):n.presetAction==="chain:reset"?console.log("📟 Chain action: reset"):console.log("📟 Preset action:",n.presetAction,n.presetName);if(n.mandalaEnabled!==void 0&&(d.mandala.enabled=n.mandalaEnabled,d.emojiMandala.enabled=n.mandalaEnabled,console.log(`🎛️ Mandala HUD: ${n.mandalaEnabled?"ON":"OFF"}`)),n.mandalaRings!==void 0){d.mandala.ringCount=n.mandalaRings,d.emojiMandala.rings=n.mandalaRings;const t=Pn==null?void 0:Pn();t&&t.setRings(n.mandalaRings)}if(n.mandalaSymmetry!==void 0){d.mandala.symmetry=n.mandalaSymmetry,d.emojiMandala.symmetry=n.mandalaSymmetry;const t=Pn==null?void 0:Pn();t&&t.setSymmetry(n.mandalaSymmetry)}if(n.mandala){const t=n.mandala,i=Pn==null?void 0:Pn();if(i){if(t.rings!==void 0&&i.setRings(t.rings),t.symmetry!==void 0&&i.setSymmetry(t.symmetry),t.scale!==void 0&&i.setScale(t.scale,t.mode),t.emoji!==void 0&&i.swapEmoji(t.emoji,t.ringIndex),t.rotationSpeed!==void 0&&i.setRotationSpeed(t.rotationSpeed),t.musicalMode!==void 0&&i.setMusicalMode(t.musicalMode),t.rootNote!==void 0&&i.setRootNote(t.rootNote),t.audioModulation!==void 0&&i.setAudioModulation(t.audioModulation),t.layeredAudio!==void 0&&i.setLayeredAudio(t.layeredAudio),t.differentialRotation!==void 0&&i.setDifferentialRotation(t.differentialRotation),t.scaleSequencing!==void 0&&i.setScaleSequencing(t.scaleSequencing),t.scaleSequence!==void 0&&i.setScaleSequence(t.scaleSequence),t.performanceMode!==void 0&&i.setPerformanceMode(t.performanceMode),t.layoutMode!==void 0&&i.setLayout(t.layoutMode),t.mandalaAudioReactive!==void 0&&i.setMandalaAudioReactive(t.mandalaAudioReactive),t.mandalaSensitivity!==void 0&&i.setMandalaSensitivity(t.mandalaSensitivity),t.layoutPreset!==void 0){const s=t.layoutPreset;s==="Classic"?i.applyClassic():s==="Flower"?i.applyFlower():s==="Spiral"?i.applySpiral():s==="Dense"&&i.applyDense()}t.ringSpacing!==void 0&&i.setRingSpacing(t.ringSpacing),t.baseRadius!==void 0&&i.setBaseRadius(t.baseRadius),t.globalScale!==void 0&&i.setGlobalScale(t.globalScale),t.rainbowMode!==void 0&&i.setRainbowMode(t.rainbowMode)}}});console.log("📟 HUD routing configured (Phase 11.7.24: MandalaController integration)");console.warn("🛰️ BEACON(main.js) 13.26",new Date().toISOString());window.debugFeatures=function(){var t;const n=i=>typeof window[i]<"u",e={source:"main.js",ts:new Date().toISOString(),projectorMode:n("ProjectorMode"),capture:n("Capture"),hotkeys:n("Hotkeys"),href:((t=globalThis==null?void 0:globalThis.location)==null?void 0:t.href)||"(no href)"};return console.warn("🛰️ FeatureScan:",e),e};setTimeout(()=>{try{window.debugFeatures()}catch{}},0);(function(){function n(){const i=document.querySelector("canvas");if(!i)throw new Error("No canvas found");return i}function e(){try{const s=n().toDataURL("image/png"),o=document.createElement("a");o.href=s,o.download=`capture_${Date.now()}.png`,document.body.appendChild(o),o.click(),o.remove(),console.log("📸 Screenshot saved (PNG)")}catch(i){console.error("Capture.png error",i)}}function t(i=.92){try{const o=n().toDataURL("image/jpeg",i),a=document.createElement("a");a.href=o,a.download=`capture_${Date.now()}.jpg`,document.body.appendChild(a),a.click(),a.remove(),console.log("📸 Screenshot saved (JPEG)")}catch(s){console.error("Capture.jpeg error",s)}}window.Capture={png:e,jpeg:t}})();(function(){function n(e){var i,s,o,a,r;const t=(e.target&&e.target.tagName||"").toLowerCase();t==="input"||t==="textarea"||e.isComposing||((e.key==="p"||e.key==="P")&&(document.fullscreenElement?(s=window.ProjectorMode)==null||s.toggleHUD():(i=window.ProjectorMode)==null||i.on()),(e.key==="f"||e.key==="F")&&(document.fullscreenElement?(a=window.ProjectorMode)==null||a.off():(o=window.ProjectorMode)==null||o.on()),(e.key==="s"||e.key==="S")&&((r=window.Capture)==null||r.png()))}window.Hotkeys={install(){window.removeEventListener("keydown",n,!0),window.addEventListener("keydown",n,!0),console.log("⌨️ Hotkeys installed (P=presentation HUD, F=fullscreen toggle, S=screenshot)")}},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>window.Hotkeys.install(),{once:!0}):window.Hotkeys.install()})();const Av=new URLSearchParams(location.search);var dd;const rl=Av.get("role")||((dd=window.env)!=null&&dd.isElectron?"primary":"secondary"),ll=rl==="primary";window.AppRole={ROLE:rl,IS_PRIMARY:ll};console.log(`🎭 Renderer role: ${rl} (primary owns audio/MIDI)`);var Zu={render:()=>{},setThreshold:()=>{},setGain:()=>{},setColors:()=>{},setPalette:()=>{},setShadowGain:()=>{}};console.log("📦 ShadowBox safe stub active (Phase 2.3.3SS) - prevents initialization errors");let La=null,cl=null,Qu=null,Ia=null;!ll&&(st!=null&&st.start)&&(st.start.bind(st),st.start=async(...n)=>(console.log("🔒 Secondary role: AudioEngine.start() blocked"),{ok:!1,reason:"secondary-role"}));!ll&&navigator.requestMIDIAccess&&(navigator.requestMIDIAccess.bind(navigator),navigator.requestMIDIAccess=async(...n)=>(console.log("🔒 Secondary role: MIDI access stubbed"),{inputs:new Map,outputs:new Map,onstatechange:null}));Au();console.log("🔄 Build timestamp:",new Date().toISOString());class Rv{constructor(e,t){console.log("⚠️ ShadowBox initialized in FAILSAFE mode (Phase 2.3.3R) - rendering disabled"),this.renderer=t,this.plane=null}render(e){}setThreshold(e){console.log(`📦 ShadowBox threshold set: ${e.toFixed(2)} (failsafe mode)`)}setGain(e){console.log(`📦 ShadowBox gain set: ${e.toFixed(1)} (failsafe mode)`)}setColors(e,t){console.log(`📦 ShadowBox colors set: bg=${e}, fg=${t} (failsafe mode)`)}setPalette(e){console.log(`📦 ShadowBox palette set: ${e} (failsafe mode)`)}setShadowGain(e){console.log(`📦 ShadowBox gain (legacy) set: ${e.toFixed(1)} (failsafe mode)`)}}Ju();ry(()=>{console.log("🎹 MIDI ready")});_u();bu();try{const n=JSON.parse(localStorage.getItem("presets")||"{}");Object.keys(n).length>0&&console.log("💾 Restored presets from localStorage")}catch(n){console.warn("💾 Failed to restore presets:",n)}pu();vv();_y(ft);Kr(ft);const Pv=Wu(ft);window.morphShape=Pv;console.log("🔺 Morph Shape initialized and exposed globally");Zx(ft);Jr(ft,En,qt);window.Vessel={show:n=>setVesselVisible(n),color:n=>setVesselColor(n),wire:n=>setVesselWireframe(n),sky:(n,e=30)=>setVesselAsSkydome(ft,n,e)};window.Conflat={show:n=>setConflatVisible(n),set:(n,e)=>setConflat(n,e)};window.addEventListener("keydown",n=>{var e;if(n.shiftKey){if(n.code==="KeyV"){const t=((e=getVessel())==null?void 0:e.visible)??!0;setVesselVisible(!t)}if(n.code==="KeyS"){const t=getVessel();t&&setVesselAsSkydome(ft,!t.userData.isSkydome,40)}if(n.code==="KeyC"){const t=getConflat(),i=!t||t.material.opacity<.05;setConflatVisible(!0),setConflat(i?"#101018":"#000000",i?.18:0)}}});Zu=new Rv(ft,En);console.log("📦 ShadowBox stub replaced with failsafe instance");d.particlesEnabled&&mo(ft,d.particlesCount);La=new uu(ft);window.emojiStreamManager=La;cl=new hu(La);window.emojiSequencer=cl;Qu=new fu(La,cl);window.emojiBankManager=Qu;Ia=new Mv(ft,{rings:d.emojiMandala.rings,symmetry:d.emojiMandala.symmetry,scale:d.emojiMandala.scale,rotationSpeed:d.emojiMandala.rotationSpeed,emojiLayout:d.emojiMandala.layout});window.mandalaController=Ia;console.log("🎛️ MandalaController initialized and exposed globally");const sa=Ia.getState();console.log(`🔗 Mandala bound to HUD + MIDI (rings=${sa.rings}, symmetry=${sa.symmetry}, scale=${sa.scale}, mode=${sa.mode})`);console.log("🔗 Mandala → Animation Loop: ✅ | HUD Routing: ✅ | MIDI Routing: ✅");let dl=!1,yr=0,vr=0;window.addEventListener("mousedown",()=>{dl=!0});window.addEventListener("mouseup",()=>{dl=!1});window.addEventListener("mousemove",n=>{var e;yr=n.clientX,vr=n.clientY,dl&&((e=d.emojiPhysics)!=null&&e.mouseInteraction)&&(window.emojiStreamManager&&window.emojiStreamManager.streams.forEach((t,i)=>{t.enabled&&t.applySwirlForce(yr,vr)}),window.emojiParticles&&window.emojiParticles.applySwirlForce(yr,vr))});bv(()=>({midiDevices:nu(),hudIdle:d.idleSpin,morphState:{current:d.morphState.current,previous:d.morphState.previous,progress:d.morphState.progress,weights:{...d.morphWeights},isTransitioning:d.morphState.isTransitioning,targets:d.morphState.targets},currentPreset:d.presets.currentPresetName,audioData:{bass:d.audio.bass,mid:d.audio.mid,treble:d.audio.treble,isEnabled:d.audio.enabled,sensitivity:d.audio.sensitivity},visualData:{ambientIntensity:d.lighting.ambientIntensity,directionalIntensity:d.lighting.directionalIntensity,color:d.color,hue:d.hue}}));setTimeout(()=>{lo(vo())},100);window.addEventListener("keydown",n=>{if(n.key==="p"||n.key==="P"){const e=d.morphState.targets,i=(e.indexOf(d.morphState.current)+1)%e.length,s=e[i];d.morphState.previous=d.morphState.current,d.morphState.current=s,e.forEach(o=>{d.morphWeights[o]=0}),d.morphWeights[s]=1,console.log(`🔄 Toggled to morph target: ${s}`)}});console.log("✅ main.js loaded – all modules imported");function eh(){return Zu}function Lv(){return Ia}function Iv(n){console.log("🔍 Scene Object Inventory:"),console.log("===========================");let e=0;n.traverse(t=>{if(t.isMesh||t.isLine||t.isLineSegments){e++;const i=t.geometry?t.geometry.type:"unknown",s=t.material?`${t.material.type} (wireframe:${t.material.wireframe})`:"no material";console.log(`${e}. ${t.type} | name="${t.name||"(unnamed)"}" | geometry=${i} | material=${s}`),console.log(`   visible=${t.visible} | position=(${t.position.x.toFixed(2)}, ${t.position.y.toFixed(2)}, ${t.position.z.toFixed(2)})`),console.log("   ",t)}}),console.log("==========================="),console.log(`Total renderable objects: ${e}`)}setTimeout(()=>{Iv(ft)},2e3);console.log("✅ Phase 13.4 HUD System Ready (Signal Bridge)");(function(){const e=`
    html.projector-mode, body.projector-mode { cursor: none !important; }
    /* Hide common HUD roots (we don't assume exact id/class) */
    .projector-mode [data-hud-root],
    .projector-mode #hud,
    .projector-mode .hud-root { display: none !important; }
    /* Optional: keep canvas clean edge-to-edge */
    .projector-mode body { background: #000 !important; }
  `,t=document.createElement("style");t.id="projector-mode-style",t.textContent=e,document.head.appendChild(t);async function i(){try{const c=document.documentElement;!document.fullscreenElement&&c.requestFullscreen&&await c.requestFullscreen({navigationUI:"hide"}).catch(()=>{})}catch{}}async function s(){try{document.fullscreenElement&&await document.exitFullscreen().catch(()=>{})}catch{}}function o(c){try{const u=window.renderer;if(u!=null&&u.setPixelRatio){if(c){const l=Math.min(2,(window.devicePixelRatio||1)*1.15);u.setPixelRatio(l)}else u.setPixelRatio(window.devicePixelRatio||1);u.setSize(window.innerWidth,window.innerHeight,!1)}}catch{}}window.ProjectorMode=window.ProjectorMode||{enabled:!1,async enable(){this.enabled||(document.documentElement.classList.add("projector-mode"),document.body.classList.add("projector-mode"),await i(),o(!0),this.enabled=!0,console.log("🖥️ Projector Mode: ON"),r())},async disable(){this.enabled&&(document.documentElement.classList.remove("projector-mode"),document.body.classList.remove("projector-mode"),o(!1),await s(),this.enabled=!1,console.log("🖥️ Projector Mode: OFF"),r())},async toggle(){return this.enabled?this.disable():this.enable()}};function a(){const c=document.createElement("button");return c.id="__projector_btn__",c.textContent="🖥️ Projector Mode",c.style.cssText=`
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 16px;
      background: rgba(0,0,0,0.8);
      color: #fff;
      border: 1px solid #555;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-family: system-ui, -apple-system, sans-serif;
      z-index: 9999;
      transition: background 0.2s;
    `,c.addEventListener("mouseenter",()=>{c.style.background="rgba(40,40,40,0.9)"}),c.addEventListener("mouseleave",()=>{c.style.background="rgba(0,0,0,0.8)"}),c.addEventListener("click",()=>{window.ProjectorMode.toggle()}),document.body.appendChild(c),c}function r(){const c=document.getElementById("__projector_btn__");c&&(c.textContent=window.ProjectorMode.enabled?"✖️ Exit Projector":"🖥️ Projector Mode")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a):a(),window.addEventListener("keydown",async c=>{if(c.key==="Escape"&&window.ProjectorMode.enabled)return c.preventDefault(),window.ProjectorMode.disable();if((c.key==="P"||c.key==="p")&&c.shiftKey&&!c.metaKey&&!c.ctrlKey&&!c.altKey)return c.preventDefault(),window.ProjectorMode.toggle()}),document.addEventListener("fullscreenchange",()=>{!document.fullscreenElement&&window.ProjectorMode.enabled&&window.ProjectorMode.disable()})})();(function(){function e(){var o;const s=(o=window==null?void 0:window.renderer)==null?void 0:o.domElement;return s||console.warn("📸 Capture: renderer canvas not found"),s}function t(s=0){const o=e();if(!o)return null;const a=o.width,r=o.height,c=document.createElement("canvas");c.width=a,c.height=r;const u=c.getContext("2d",{willReadFrequently:!0});if(u.drawImage(o,0,0,a,r),s&&s>1){const h=255/(Math.max(2,Math.min(32,s|0))-1),f=u.getImageData(0,0,a,r),m=f.data;for(let x=0;x<m.length;x+=4)m[x]=Math.round(m[x]/h)*h,m[x+1]=Math.round(m[x+1]/h)*h,m[x+2]=Math.round(m[x+2]/h)*h;u.putImageData(f,0,0)}return c.toDataURL("image/png")}function i({posterize:s=!1,levels:o=6,filename:a}={}){const r=t(s?o:0);if(!r)return{ok:!1,reason:"no-canvas"};const c=new Date().toISOString().replace(/[:.]/g,"-"),u=a||`morph_capture_${c}${s?`_pz${o}`:""}.png`,l=document.createElement("a");return l.href=r,l.download=u,document.body.appendChild(l),l.click(),l.remove(),console.log(`📸 Saved ${u} (posterize=${s?o:0})`),{ok:!0,name:u,url:r}}window.Capture=window.Capture||{dataURL:t,save:i},console.log("📸 Capture ready (Phase 13.22)")})();(function(){const e=`
    html.hud-hidden, body.hud-hidden { cursor: auto; }
    .hud-hidden [data-hud-root],
    .hud-hidden #hud,
    .hud-hidden .hud-root { display: none !important; }
  `,t=document.createElement("style");t.id="onekey-style",t.textContent=e,document.head.appendChild(t);function i(u){const l=u.target,h=((l==null?void 0:l.tagName)||"").toLowerCase();return(l==null?void 0:l.isContentEditable)||h==="input"||h==="textarea"||h==="select"}async function s(){var u,l,h;try{document.fullscreenElement?await((h=document.exitFullscreen)==null?void 0:h.call(document)):await((l=(u=document.documentElement).requestFullscreen)==null?void 0:l.call(u,{navigationUI:"hide"}))}catch{}}function o(){const u=document.body.classList.toggle("hud-hidden");document.documentElement.classList.toggle("hud-hidden",u),console.log(`🧰 HUD ${u?"hidden":"visible"}`)}function a(){const u=window.scene||window.Scene||window.THREE_SCENE;if(!(u!=null&&u.traverse))return console.warn("⚠️ Wireframe: scene not found");let l=0,h,f=null;u.traverse(m=>{m.isMesh&&m.material&&f===null&&(f=!!m.material.wireframe)}),h=!f,u.traverse(m=>{m.isMesh&&m.material&&(Array.isArray(m.material)?m.material.forEach(x=>x.wireframe=h):m.material.wireframe=h,l++)}),console.log(`🧵 Wireframe: ${h?"ON":"OFF"} (meshes affected: ${l})`)}function r(){var l,h;const u=(h=(l=window.Capture)==null?void 0:l.save)==null?void 0:h.call(l,{posterize:!1});u!=null&&u.ok||console.warn("📸 Screenshot failed or Capture not ready")}function c(){try{const u=window.appState||window.state||{},h=!!!u.audioReactive;"audioReactive"in u&&(u.audioReactive=h),typeof window.onHUDUpdate=="function"?window.onHUDUpdate({audioReactive:h}):typeof window.notifyHUDUpdate=="function"&&window.notifyHUDUpdate({audioReactive:h}),console.log(`🎛️ Audio-reactive: ${h?"ON":"OFF"}`)}catch(u){console.warn("⚠️ Audio-reactive toggle not available:",u)}}window.addEventListener("keydown",async u=>{var h;if(i(u)||u.metaKey||u.ctrlKey||u.altKey)return;const l=u.key;if(l==="F"||l==="f")return u.preventDefault(),(h=window.ProjectorMode)!=null&&h.toggle?window.ProjectorMode.toggle():s();if(l==="H"||l==="h")return u.preventDefault(),o();if(l==="S"||l==="s")return u.preventDefault(),r();if(l==="W"||l==="w")return u.preventDefault(),a();if(l==="M"||l==="m")return u.preventDefault(),c()}),console.log("⌨️ One-Key Hotkeys ready — F:Fullscreen, H:HUD, S:Shot, W:Wire, M:Audio")})();(function(){var i;function e(s){return typeof s=="function"}const t=()=>{var s,o,a,r,c,u;return{file:((s=import.meta)==null?void 0:s.url)||"(no import.meta.url)",ProjectorMode:{present:!!window.ProjectorMode,methods:{toggle:e((o=window.ProjectorMode)==null?void 0:o.toggle),enable:e((a=window.ProjectorMode)==null?void 0:a.enable),disable:e((r=window.ProjectorMode)==null?void 0:r.disable)}},Capture:{present:!!window.Capture,methods:{save:e((c=window.Capture)==null?void 0:c.save),dataURL:e((u=window.Capture)==null?void 0:u.dataURL)}},Hotkeys:{ready:!!document.getElementById("onekey-style")}}};window.debugFeatures=function(){const o=t();console.log("🛰️ Feature Beacons:",o);const a=[];return o.ProjectorMode.present||a.push("ProjectorMode missing (Phase 13.20 not loaded)"),o.Capture.present||a.push("Capture missing (Phase 13.22 not loaded)"),o.Hotkeys.ready||a.push("One-Key Hotkeys CSS not found (Phase 13.24 not loaded)"),a.length?console.warn("🛑 Missing features:",a):console.log("✅ All requested features detected"),{s:o,problems:a}},console.log("🛰️ Beacons online (Phase 13.25) from",((i=import.meta)==null?void 0:i.url)||"(unknown)")})();const ki=Object.freeze(Object.defineProperty({__proto__:null,getMandalaController:Lv,getShadowBox:eh},Symbol.toStringTag,{value:"Module"}));
//# sourceMappingURL=index-TEhoKfFp.js.map
