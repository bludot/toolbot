# markovchain-generate
#### A simple, intuitive Markov Chain generator for Javascript

## Installation
```bash
npm install markovchain-generate
```

## Usage
```javascript
var MarkovChain = require('markovchain-generate');

// For an empty chain, use an empty constructor.
var chain = new MarkovChain()

// Get a string of text and feed it into the markov chain generator.
var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum."
chain.generateChain(text);

// Generate strings to your heart's content!
var generated_string = chain.generateString();
console.log(generated_string);

// You can dump the current state of the probability table...
var probabilities = chain.dump();

// ... and you can load up a previously dumped version, as well.
chain.load(probabilities);

```