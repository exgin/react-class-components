import React from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

// props = numJokesToGet
class JokeList extends React.Component {
  static defaultProps = {numJokesToGet = 10}

  constructor(props) {
    super(props)
    this.state = { jokes };
  }


}

export default JokeList;
