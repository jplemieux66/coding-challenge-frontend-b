import React, { Component } from 'react';
import './App.css';
import OnboardingScreen from './components/onboarding-screen/OnboardingScreen';
import ResultsScreen from './components/results-screen/ResultsScreen';
import { getParsedDeparturesObservable } from './api-service/apiService';
import { ClipLoader } from 'react-spinners';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departures: [],
      displayOnboardingScreen: true,
      displayLoader: false,
      displayResultsScreen: false
    };

    this.handleOnboardingSubmit = this.handleOnboardingSubmit.bind(this);
  }

  handleOnboardingSubmit(originCity, destinationCity, date, numberOfPassengers) {
    this.setState({
      displayOnboardingScreen: false,
      displayLoader: true
    });

    let parsedDepartures = getParsedDeparturesObservable(originCity, destinationCity, date, numberOfPassengers);

    parsedDepartures.subscribe(departures => {
      if (departures.length > 0) {
        this.setState({
          departures,
          displayLoader: false,
          displayResultsScreen: true
        });
      } else {
        this.setState({
          departures
        });
      }
    });
  }

  render() {
    return (
      <div className="app-container">
        <div className="onboarding-screen-container" style={{display: this.state.displayOnboardingScreen ? 'block' : 'none'}}>
          <OnboardingScreen
            originCity="New York"
            destinationCity="Montreal"
            date="2018-08-02"
            numberOfPassengers={1}
            onSubmit={this.handleOnboardingSubmit}
          />
        </div>
        <div className="results-screen-container" style={{display: this.state.displayResultsScreen ? 'block' : 'none'}}>
          <ResultsScreen departures={this.state.departures} />
        </div>
        <div className="loader" style={{display: this.state.displayLoader ? 'block' : 'none'}}>
          <ClipLoader loading={true} />
        </div>
      </div>
    );
  }
}

export default App;