import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Categories from './page/Categories/Categories';

export default class Appmain extends Component {
     render() {
          return (

               <React.Fragment>
                    <Switch>
                         <Route exact path="/" component={Categories} />
                    </Switch>

               </React.Fragment>

          )
     }
}
