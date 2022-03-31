import React from 'react';
import { Helmet } from 'react-helmet';
import About from 'src/components/about';
import MapLayout from 'src/components/map-layout';
import * as i18n from 'src/i18n';
import { Filter, Page, UpdateFilter } from 'src/state';

import { AppContext } from './components/context';
import Header from './components/header';
import Map, { MarkerIdAndInfo, ResultsSet } from './components/map';
import Results from './components/results';
import styled, {
  CLS_SCREEN_LG_HIDE,
  CLS_SCREEN_LG_ONLY,
  LARGE_DEVICES,
} from './styling';
import { isInFrame, isReferrerFromBaseSite } from './util';

interface Props {
  className?: string;
}

interface State {
  filter: Filter;
  results: ResultsSet | null;
  nextResults: ResultsSet | null;
  resultsOpen: boolean;
  selectedResult: MarkerIdAndInfo | null;
  showResultDetails: boolean;
  updateResultsCallback: (() => void) | null;
  lang: i18n.Language;
  inFrame: boolean;
  page: Page;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filter: { filterExecuted: false },
      results: null,
      nextResults: null,
      resultsOpen: false,
      showResultDetails: false,
      selectedResult: null,
      updateResultsCallback: null,
      lang: i18n.getLanguage(),
      inFrame: isInFrame(),
      page: {
        page: isReferrerFromBaseSite() || isInFrame() ? 'map' : 'about',
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setFilter: UpdateFilter = (fieldName: string, value: any) => {
    this.setState(state => ({
      filter: { ...state.filter, [fieldName]: value },
    }));
  };

  private setResults = (results: ResultsSet, openResults?: boolean) => {
    this.setState(state => ({
      results,
      resultsOpen: openResults ? true : state.resultsOpen,
    }));
  };

  private setUpdateResultsCallback = (callback: (() => void) | null) => {
    this.setState({ updateResultsCallback: callback });
  };

  private setSelectedResult = (
    selectedResult: MarkerIdAndInfo | null,
    showDetails = false,
  ) => {
    this.setState({
      selectedResult,
      showResultDetails: showDetails,
    });
  };

  private setNextResults = (nextResults: ResultsSet | null) => {
    this.setState({
      nextResults,
    });
  };

  private setPage = (page: Page) => {
    this.setState({ page });
  };

  private updateResults = () => {
    const { updateResultsCallback } = this.state;
    if (updateResultsCallback) {
      updateResultsCallback();
    }
  };

  private languageUpdated = (lang: i18n.Language) => {
    this.setState({ lang });
  };

  private setResultsOpen = (resultsOpen: boolean) => {
    this.setState({ resultsOpen });
  };

  private showMoreResults = (count: number) => {
    this.setState(state => {
      if (state.results) {
        return {
          ...state,
          results: {
            ...state.results,
            showRows: state.results.showRows + count,
          },
        };
      }
      return {};
    });
  };

  public componentDidMount = () => {
    i18n.addListener(this.languageUpdated);
  };

  public componentWillUnmount = () => {
    i18n.removeListener(this.languageUpdated);
  };

  public render() {
    let { className } = this.props;
    className = className || 'unknown';
    const {
      filter,
      results,
      nextResults,
      resultsOpen,
      showResultDetails,
      selectedResult,
      page,
      lang,
      inFrame,
    } = this.state;

    return (
      <AppContext.Provider value={{ lang }}>
        <div dir={i18n.getMeta(lang).direction} className={className}>
          <Helmet>
            {i18n.LANGUAGE_KEYS.map((langKey, i) => (
              <link
                key={i}
                rel="alternate"
                hrefLang={langKey}
                href={i18n.canonicalUrl(lang)}
              />
            ))}
            <link rel="canonical" href={i18n.canonicalUrl(lang)} />
          </Helmet>
          <Header page={page} setPage={this.setPage} inFrame={inFrame} />
          <main className={`page-${page.page}`}>
            <MapLayout
              className="map-area"
              page={page}
              updateFilter={this.setFilter}
              components={{
                map: () => (
                  <Map
                    filter={filter}
                    results={results}
                    nextResults={nextResults}
                    setResults={this.setResults}
                    setNextResults={this.setNextResults}
                    selectedResult={selectedResult}
                    setSelectedResult={this.setSelectedResult}
                    setUpdateResultsCallback={this.setUpdateResultsCallback}
                    page={page}
                    setPage={this.setPage}
                    resultsOpen={resultsOpen}
                  />
                ),
                results: props => (
                  <Results
                    className={props.className}
                    results={results}
                    nextResults={nextResults}
                    open={resultsOpen}
                    setOpen={this.setResultsOpen}
                    selectedResult={selectedResult}
                    setSelectedResult={this.setSelectedResult}
                    updateResults={this.updateResults}
                    showMoreResults={this.showMoreResults}
                    showResultDetails={showResultDetails}
                  />
                ),
              }}
            />
            <About page={page} setPage={this.setPage} />
          </main>
        </div>
      </AppContext.Provider>
    );
  }
}

export default styled(App)`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${p => p.theme.textColor};

  * {
    font-family: 'Roboto', sans-serif;
  }

  > main {
    overflow: hidden;
    position: relative;
    display: flex;
    flex-grow: 1;
    height: 0;
    min-height: 150px;

    > .map-area {
      flex-grow: 1;
    }
  }

  a {
    color: ${p => p.theme.textLinkColor};
    text-decoration: none;

    &:hover {
      color: ${p => p.theme.textLinkHoverColor};
      text-decoration: underline;
    }
  }

  .info-window {
    font-size: 1rem;
    font-weight: 400;
  }

  .mobile-message {
    display: none;
    padding: ${p => p.theme.spacingPx / 2}px;
    font-size: 1.5rem;

    p {
      margin: 0;
      padding: ${p => p.theme.spacingPx / 2}px;
    }
  }

  .${CLS_SCREEN_LG_ONLY} {
    display: none;

    ${LARGE_DEVICES} {
      display: initial;
    }
  }

  .${CLS_SCREEN_LG_HIDE} {
    ${LARGE_DEVICES} {
      display: none;
    }
  }
`;
