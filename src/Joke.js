import React from 'react';
import './Joke.css';

// props = vote, votes, text, id
class Joke extends React.Component {
  constructor(props) {
    super(props);
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
  }

  upVote() {
    this.props.vote(this.props.id + 1);
  }

  downVote() {
    this.props.vote(this.props.id - 1);
  }

  render() {
    const { votes, text } = this.props;

    return (
      <div className='Joke'>
        <div className='Joke-votearea'>
          <button onClick={this.upVote}>+</button>
          <button onClick={this.downVote}>-</button>

          {votes}
        </div>

        <div className='Joke-text'>{text}</div>
      </div>
    );
  }
}

export default Joke;
