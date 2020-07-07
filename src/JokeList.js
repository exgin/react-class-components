import React from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

// props = numJokesToGet
class JokeList extends React.Component {
  static defaultProps = { numJokesToGet: 10 };

  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    // this.generateNewJokes = this.generateNewJokes(this);
    this.resetVotes = this.resetVotes.bind(this);
    this.vote = this.vote.bind(this);
    this.generateNewJokes = this.vote.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  // get tge jokes from jokes API
  async getJokes() {
    try {
      let jokes = this.state.jokes;

      // find all of the votes within localStorage
      let jokeVotes = JSON.parse(window.localStorage.getItem('jokeVotes') || '{}');

      // remove all the same jokes from the API that we get
      let seenJokes = new Set(jokes.map((joke) => joke.id));

      // get jokes all the way up to 10
      while (jokes.length < this.props.numJokesToGet) {
        // fetch data
        let results = await axios.get('https://icanhazdadjoke.com', { headers: { Accept: 'application/json' } });
        let { status, ...jokeObj } = results.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          jokes.push({ ...jokeObj, votes: 0 });
        } else {
          console.log('duplicate joke found!');
        }
      }

      this.setState({ jokes });
      window.localStorage.setItem('jokeVotes', JSON.stringify(jokeVotes));
    } catch (error) {
      console.log(error);
    }
  }

  vote(id, num) {
    let jokeVotes = JSON.parse(window.localStorage.getItem('jokeVotes')); // get all the jokes from localStorage
    jokeVotes[id] = (jokeVotes[id] || 0) + num;
    window.localStorage.setItem('jokeVotes', JSON.stringify(jokeVotes));
    this.setState((state) => ({
      jokes: state.jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + num } : j)),
    }));
  }

  generateNewJokes() {
    this.setState((st) => ({ jokes: st.jokes.filter((j) => j.locked) }));
  }

  resetVotes() {
    window.localStorage.setItem('jokeVotes', '{}');
    this.setState((st) => ({
      jokes: st.jokes.map((joke) => ({ ...joke, votes: 0 })),
    }));
  }

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

    return (
      <div className='JokeList'>
        <button className='JokeList-getmore'>Get New Jokes</button>
        <button className='JokeList-getmore' onClick={this.resetVotes}>
          Reset votes
        </button>
        {sortedJokes.map((j) => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
        ))}

        {sortedJokes.length < this.props.numJokesToGet ? (
          <div className='loading'>
            <p>LOADING!</p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default JokeList;
