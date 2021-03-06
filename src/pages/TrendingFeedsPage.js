import * as React from "react";
import { connect } from "react-redux";

import { fetchNewsList } from '../actions/TrendingFeedsAction';
import InfiniteScroll from 'react-infinite-scroll-component';
import { findSourceLogo } from '../util/ImageUtil';
import { prettyDateTime } from '../util/CommonUtil';

import {
  Page,
  Grid,
  BlogCard,
} from "tabler-react";

import EmptyPageContent from "../components/Placeholder/EmptyPageContent";

class TrendingFeedsPage extends React.Component {
  componentDidMount() {
    const dispatch = this.props.dispatch;
    dispatch(fetchNewsList());
  }

  loadMoreData = () => {
    const dispatch = this.props.dispatch;
    let page = 1;
    const trendingFeedsReducer = this.props.trendingFeedsReducer;

    if (trendingFeedsReducer && trendingFeedsReducer.page) {
      page = trendingFeedsReducer.page;
    }

    if (page < 1) {
      page = 1;
    }
    dispatch(fetchNewsList(page));
  }

  render() {
    const { trendingFeedsReducer } = this.props;
    const newsList = [...(trendingFeedsReducer.list || [])];

    const mainNews = [];
    const moreNews = [];
    if (newsList.length === 0) {
      /* there are no item in response list */
    } else if (newsList.length <= 7) {
      /* no more than 7 items */
      for (var i = 0; i < newsList.length; i++) {
        let item = newsList[i];
        mainNews.push(
          <Grid.Col width={12}>
            <BlogCard
              imgSrc={item.thumbnail}
              imgAlt={item.summary}
              title={item.title}
              description={item.summary}
              profileHref={item.source.baseUrl}
              postHref={item.source.url}
              authorName={item.source.displayName}
              avatarImgSrc={findSourceLogo(item.source.name)}
              date={prettyDateTime(item.publicationDate)}
              iconName={"arrow-right"}
            />
          </Grid.Col>)
      }

    } else {
      /* more than 7 items
      
      */
      mainNews.push(
        /* the biggest first item */
        <Grid.Col width={12} lg={9} md={12}>
          <BlogCard
            imgSrc={newsList[0].thumbnail}
            imgAlt={newsList[0].summary}
            title={newsList[0].title}
            description={newsList[0].summary}
            postHref={newsList[0].source.url}
            profileHref={newsList[0].source.baseUrl}
            authorName={newsList[0].source.displayName}
            avatarImgSrc={findSourceLogo(newsList[0].source.name)}
            date={prettyDateTime(newsList[0].publicationDate)}
            iconName={"arrow-right"}
          />
        </Grid.Col>);

      mainNews.push(
        /* two items on the right */
        <Grid.Col width={12} lg={3} md={12}>
          <Grid.Row>
            <Grid.Col width={12} lg={12} md={6}>
              <BlogCard
                imgSrc={newsList[1].thumbnail}
                title={newsList[1].title}
                //description={newsList[1].summary}
                postHref={newsList[1].source.url}
                profileHref={newsList[1].source.baseUrl}
                authorName={newsList[1].source.displayName}
                avatarImgSrc={findSourceLogo(newsList[1].source.name)}
                date={prettyDateTime(newsList[1].publicationDate)}
                iconName={"arrow-right"}
              />
            </Grid.Col>
            <Grid.Col width={12} lg={12} md={6}>
              <BlogCard
                imgSrc={newsList[2].thumbnail}
                title={newsList[2].title}
                //description={newsList[1].summary}
                postHref={newsList[2].source.url}
                profileHref={newsList[2].source.baseUrl}
                authorName={newsList[2].source.displayName}
                avatarImgSrc={findSourceLogo(newsList[2].source.name)}
                date={prettyDateTime(newsList[2].publicationDate)}
                iconName={"arrow-right"}
              />
            </Grid.Col>
          </Grid.Row>
        </Grid.Col>
      );

      for (let i = 3; i < 7; i++) {
        let item = newsList[i];
        mainNews.push(
          <Grid.Col width={12} lg={6} xl={3} md={6}>
            <BlogCard
              imgSrc={item.thumbnail}
              // imgAlt={item.summary}
              title={item.title}
              description={item.summary}
              postHref={item.source.url}
              profileHref={item.source.baseUrl}
              authorName={item.source.displayName}
              avatarImgSrc={findSourceLogo(item.source.name)}
              date={prettyDateTime(item.publicationDate)}
              iconName={"arrow-right"}
            />
          </Grid.Col>)
      }

      for (let i = 6; i < newsList.length; i++) {
        let item = newsList[i];
        moreNews.push(
          <Grid.Col width={12}>
            <BlogCard
              aside
              imgSrc={item.thumbnail}
              imgAlt={item.summary}
              postHref={item.source.url}
              title={item.title}
              description={item.summary}
              profileHref={item.source.baseUrl}
              authorName={item.source.displayName}
              avatarImgSrc={findSourceLogo(item.source.name)}
              date={prettyDateTime(item.publicationDate)}
              iconName={"arrow-right"}
            />
          </Grid.Col>
        )
      }

    }

    let endOfPage;
    if (!trendingFeedsReducer.hasMore && newsList.length !== 0) {
      endOfPage =
        <div class="col-12 d-flex justify-content-center">
          <div class="text-muted bold" style={{
            backgroundColor: "transparent",
            backgroundClip: "unset",
            border: "0",
            borderRadius: "0",
            boxShadow: "none"
          }}>Oop! H???t tin r???i, quay l???i sau nh??!</div>
        </div>
    }
    let body;
    if (newsList.length !== 0) {
      body = <Page.Content title="Xu hu???ng">
        <Grid.Row cards deck>
          {mainNews}
        </Grid.Row>
        <Grid.Row>
          <Page.Header title={"Tin kh??c"} />
          <InfiniteScroll
            dataLength={newsList.length}
            next={this.loadMoreData}
            hasMore={trendingFeedsReducer.hasMore}
            loader={
              <div class="col-12 d-flex justify-content-center">
                <div class="loader card" style={{
                  backgroundColor: "transparent",
                  backgroundClip: "unset",
                  border: "0",
                  borderRadius: "0",
                  boxShadow: "none"
                }} />
              </div>}>
            {moreNews}
            {endOfPage}
          </InfiniteScroll>
        </Grid.Row >
      </Page.Content >
    } else {
      let emptyBody = (trendingFeedsReducer && trendingFeedsReducer.isFetching) ? (<div className="p-empty-body col-12 d-flex justify-content-center">
        <div className="loader card" style={{
          backgroundColor: "transparent",
          backgroundClip: "unset",
          border: "0",
          borderRadius: "0",
          boxShadow: "none"
        }} />
      </div>) : <EmptyPageContent onButtonClick={this.loadMoreData} />;
      body = <Page.Content>
        {emptyBody}
      </Page.Content>
    }

    return body

  }
}


function mapStateToProps({ trendingFeedsReducer, authReducer }) {
  return {
    trendingFeedsReducer,
    authReducer
  }
}


export const TrendingFeedsContainer = connect(
  mapStateToProps
)(TrendingFeedsPage);