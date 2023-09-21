import React from 'react';
import {DecisionTree} from '@carbon/icons-react';
import './header.css';

export default class Header extends React.Component {
  render() {
    const {onClick} = this.props;
    return (
      <React.Fragment>
        <div className={'header'}>
          <div className={'title-wrapper'}>
            <DecisionTree size={32}/>
            <span className={'title-header'}>Java Application Modernization Playbook</span>
          </div>
          <div className={'additional-header-links'}>
            <span><a href='#' onClick={onClick}> About</a> </span>
            <span><a target='_blank'  rel='noopener noreferrer' href='https://github.com/IBM/app-mod-journey/tree/main'> Contribute</a> </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}