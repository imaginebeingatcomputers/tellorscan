import {Types} from './actions';
import {createReducer} from 'reduxsauce';
import _ from 'lodash';

const INIT_STATE = {
  loading: false,
  error: null,
  byId: {}
}
const initStart = (state=INIT_STATE, action) => {
   return {
     ...state,
     loading: true,
     error: null
   }
 }

const initSuccess = (state=INIT_STATE, action) => {
   let requests = action.requests;
   return {
     ...state,
     loading: false,
     byId: requests
   }
 }

const addRequest = (state=INIT_STATE, action) => {
   let req = action.request;
   let ex = state.byId[req.id];
   if(ex) {
     return state;
   }

   let byId = {
     ...state.byId,
     [req.id]: req
   };
   return {
     ...state,
     byId
   }
 }

const addChallenge = (state=INIT_STATE, action) => {
   let ch = action.challenge;
   let req = state.byId[ch.id];
   req = {
     ...req
   }

   let byId = {
     ...state.byId,
     [req.id]: req
   }
   req.challenges = {
     ...req.challenges,
     [ch.challengeHash]: ch
   }
   //have to limit size of challenges to most recent 50
   let cHashes = _.keys(req.challenges);
   if(cHashes.length > 50) {
     //challenges sorted in descening time order
     let challenges = _.values(req.challenges);
     challenges.sort((a,b)=>b.timestamp-a.timestamp);
     challenges = challenges.slice(0, 50);
     req.challenges = challenges.reduce((o,c)=>{
       o[c.challengeHash] = c;
       return o;
     },{});
   }

   return {
     ...state,
     byId
   }
 }

const addNonce = (state=INIT_STATE, action) => {
   let nonce = action.nonce;
   let req = state.byId[nonce.id];
   req = {
     ...req
   };
   let byId = {
     ...state.byId,
     [req.id]: req
   };
   let challenges = {
     ...req.challenges
   };
   let ch = {
     ...challenges[nonce.challengeHash]
   };
   challenges[nonce.challengeHash] = ch;

   req.challenges = challenges;
   ch.nonces = [
     ...ch.nonces,
     nonce
   ];
   console.log("Added nonce to challenge", nonce, ch);
    return {
     ...state,
     byId
   }
 }

const nonceUpdated = (state=INIT_STATE, action) => {
   let nonce = action.nonce;
   let req = state.byId[nonce.id];
   req = {
     ...req
   };
   let byId = {
     ...state.byId,
     [req.id]: req
   };
   let challenges = {
     ...req.challenges
   };
   let ch = {
     ...challenges[nonce.challengeHash]
   };
   challenges[nonce.challengeHash] = ch;
   req.challenges = challenges;
   ch.nonces = [
     ...ch.nonces.filter(n=>n.miner!==nonce.miner),
     nonce
   ];
    return {
     ...state,
     byId
   }
 }

const addNewValue = (state=INIT_STATE, action) => {
   let newVal = action.value;
   let order = action.minerOrder;
   let req = state.byId[newVal.id];
   req = {
     ...req
   };
   let byId = {
     ...state.byId,
     [req.id]: req
   };
   let challenges = {
     ...req.challenges
   };
   let ch = {
     ...challenges[newVal.challengeHash]
   };

   ch.finalValue = newVal;
   ch.minerOrder = order;
   challenges[newVal.challengeHash] = ch;
   req.challenges = challenges;
   return {
     ...state,
     byId
   }
 }

const fail = (state=INIT_STATE, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}



const HANDLERS = {
  [Types.INIT_START]: initStart,
  [Types.INIT_SUCCESS]: initSuccess,
  [Types.FAILURE]: fail,
  [Types.ADD_REQUEST]: addRequest,
  [Types.ADD_CHALLENGE]: addChallenge,
  [Types.ADD_NONCE]: addNonce,
  [Types.NONCE_UPDATED]: nonceUpdated,
  [Types.ADD_NEW_VALUE]: addNewValue
}

export default createReducer(INIT_STATE, HANDLERS);
