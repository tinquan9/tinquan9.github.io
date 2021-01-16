import * as React from "react";
import PropTypes from 'prop-types';
import { fetchNewsList } from '../actions/HeadlinesFeedsAction';
import InfiniteScroll from 'react-infinite-scroll-component';
import { findSourceLogo } from '../util/ImageUtil';
import { momentFromNow } from '../util/CommonUtil';

import {
  Page,
  Grid,
  Card,
} from "tabler-react";

import SiteWrapper from "../components/SiteWrapper.react";
import HeadlineFeed from "../components/HeadlineFeed";
import ErrorPageContent from "../components/Placeholder/ErrorPageContent";

export default class HeadlinesFeedsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchNewsList());
  }

  loadMoreData = () => {
    const { dispatch } = this.props;
    let page = 1;
    const headlinesReducer = this.props.headlines;
    if (headlinesReducer && headlinesReducer.page) {
      page = headlinesReducer.page;
    }

    if (page < 1) {
      page = 1;
    }
    dispatch(fetchNewsList(page));
  }

  render() {
    const headlinesReducer = this.props.headlines;
    const authReducer = this.props.auth;
    const newsList = [...headlinesReducer.list];
    console.log("is Fetching = " + headlinesReducer.isFetching);
    console.log("statusCode = " + headlinesReducer.statusCode);
    console.log("message = " + headlinesReducer.message);

    const feeds = [];
    if (newsList.length === 0) {
      /* there are no item in response list */
    } else {

      for (var i = 0; i < newsList.length; i++) {
        const items = newsList[i].data.slice(0, newsList.length > 5 ? 5 : newsList.length);
        if (items.length === 0) {
          break;
        }
        const headline = items.shift();
        feeds.push(
          <Grid.Col key={headline.source.url + headline.title} width={12}>

            <HeadlineFeed
              title={headline.title}
              sourceUrl={headline.source.url}
              description={headline.summary}
              imageUrl={headline.thumbnail}
              date={momentFromNow(headline.publicationDate)}
              sourceBaseUrl={headline.source.baseUrl}
              sourceName={headline.source.displayName}
              sourceImageUrl={findSourceLogo(headline.source.name)}
              subs={items && items.length > 0 &&
                <React.Fragment>{
                  items.map((item, index) => (
                    <HeadlineFeed.Sub
                      key={item.source.url + item.title}
                      title={item.title}
                      sourceUrl={item.source.url}
                      sourceName={item.source.displayName}
                      sourceBaseUrl={item.source.baseUrl}
                      sourceImageUrl={findSourceLogo(item.source.name)}
                      date={momentFromNow(item.publicationDate)}
                    />))
                }
                </React.Fragment>
              } />


          </Grid.Col>
        )
      }
    }

    let endOfPage;
    if (!headlinesReducer.hasMore && newsList.length !== 0) {
      endOfPage =
        <div class="col-12 d-flex justify-content-center">
          <div class="text-muted bold" style={{
            backgroundColor: "transparent",
            backgroundClip: "unset",
            border: "0",
            borderRadius: "0",
            boxShadow: "none"
          }}>Oop! Hết tin rồi, quay lại sau nhé!</div>
        </div>
    }

    let body;
    if (newsList.length !== 0) {
      body = <Page.Content title="Tin Chính">
        <InfiniteScroll
          style={{
            height: "auto", overflow: "disabled"
          }}
          dataLength={newsList.length}
          next={this.loadMoreData}
          hasMore={headlinesReducer.hasMore}
          loader={
            <div className="col-12 d-flex justify-content-center">
              <div className="loader card" style={{
                backgroundColor: "transparent",
                backgroundClip: "unset",
                border: "0",
                borderRadius: "0",
                boxShadow: "none"
              }} />
            </div>}>
          <Grid.Row>

            {feeds}
          </Grid.Row>

          {endOfPage}
        </InfiniteScroll>
      </Page.Content >
    } else {
      let emptyBody = (headlinesReducer && headlinesReducer.isFetching) ? (<div className="p-empty-body col-12 d-flex justify-content-center">
        <div className="loader card" style={{
          backgroundColor: "transparent",
          backgroundClip: "unset",
          border: "0",
          borderRadius: "0",
          boxShadow: "none"
        }} />
      </div>) : <ErrorPageContent onButtonClick={this.loadMoreData}/>;
      body = <Page.Content>
        {emptyBody}
      </Page.Content>
    }

    let user = authReducer && authReducer.authData && authReducer.authData.user ? authReducer.authData.user : undefined;
    return (
      <SiteWrapper {...this.props.dispatch} showFooter={ !(newsList.length == 0 && headlinesReducer.isFetching) } currentUser={user}>
          {body}
      </SiteWrapper>
    )
  }
}

HeadlinesFeedsPage.propTypes = {
  list: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}