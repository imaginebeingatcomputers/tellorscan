import {connect} from 'react-redux';
import Overview from './Overview';
import {withRouter} from 'react-router-dom';
import {default as qOps} from 'Redux/events/tree/operations';

const s2p = (state,own) => {
  let byId = state.events.tree.byId;
  let id = own.match.params['apiID'];
  let q = byId[id];

  return {
    item: q
  }
}

const d2p = (dispatch,own) => {
  return {
    
  }
}

export default withRouter(connect(s2p, d2p)(Overview));
