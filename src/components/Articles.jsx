import "./css/Articles.css";
import React, { Component } from "react";
import { CardColumns, Spinner } from "react-bootstrap";
import ArticleCard from "./ArticleCard";
import { getArticles } from "../api";
import PageNumbers from "./PageNumbers";

class Articles extends Component {
  state = {
    articles: [],
    isLoading: false,
    page: 0,
    total_count: 0
  };
  render() {
    const { articles, isLoading, page, total_count } = this.state;
    const { topic, user, username } = this.props;
    const totalPages = Math.ceil(total_count / 10);
    return (
      <div>
        {topic ? (
          <p className="display-4">{topic[0].toUpperCase() + topic.slice(1)}</p>
        ) : username ? (
          <p className="display-4">{username}</p>
        ) : null}
        {isLoading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <CardColumns>
            {articles.map(article => (
              <ArticleCard
                article={article}
                key={article.article_id}
                user={user}
              />
            ))}
          </CardColumns>
        )}
        <PageNumbers
          page={page}
          totalPages={totalPages}
          changePage={this.changePage}
        />
      </div>
    );
  }
  componentDidMount() {
    const { topic, sort, username } = this.props;
    this.fetchArticles(topic, sort, 0, username);
  }

  componentDidUpdate(prevProps, prevState) {
    const { topic, sort, username } = this.props;
    const { page } = this.state;
    const sortUpdated = prevProps.sort !== sort;
    const topicUpdated = prevProps.topic !== topic;
    const pageUpdated = prevState.page !== page;
    const userUpdated = prevProps.username !== username;
    if (topicUpdated || sortUpdated || pageUpdated || userUpdated)
      this.fetchArticles(topic, sort, page, username);
  }

  changePage = ({ target }) => {
    const value = target.attributes.value
      ? target.attributes.value.value
      : target.parentNode.attributes.value.value;
    this.setState({ page: Number(value) });
  };

  fetchArticles = (topic, sort, page, username) => {
    this.setState({ isLoading: true });
    const { navigate } = this.props;
    getArticles(topic, sort, page, username)
      .then(({ articles, total_count }) => {
        if (articles.length === 0)
          navigate("/404", {
            replace: true
          });
        else
          return this.setState({
            articles,
            total_count,
            isLoading: false
          });
      })
      .catch(() => navigate("/404", { replace: true }));
  };
}

export default Articles;
