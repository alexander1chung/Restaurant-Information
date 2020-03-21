/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-console */
import React from 'react';
import $ from 'jquery';
import Details from './Details.jsx';
import WriteReview from './WriteReview.jsx';
import AddPhoto from './AddPhoto.jsx';



class RestaurantInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Restaurant: {}, Review: {}, ShowDetails: false, ShowPhotoForm: false, ShowReviewForm: false, allReview: [] };
    this.updateState = this.updateState.bind(this);
    this.updateDetailsClickStatus = this.updateDetailsClickStatus.bind(this);
    this.updateWriteReviewClickStatus = this.updateWriteReviewClickStatus.bind(this);
    this.updateAddPhotoClickStatus = this.updateAddPhotoClickStatus.bind(this);
}

  componentDidMount() {
    const that = this;
    $.ajax({
      method: 'GET',
      url: '/restaurant',
      dataType: 'json',
      success: (data) => {
        console.log('this is my ajax call from restaurant Info', data);
        that.updateState(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateState (data) {
    var claimStatus;
    const that = this;
    const allReview = [];
    if (data[0].claimed === 'true') {
      claimStatus = 'Claimed';
    } else {
      claimStatus = 'Unclaimed';
    }
    const restaurant = {
      claimed: claimStatus, name: data[0].restaurantname, price: data[0].prize, category: data[0].category 
    };
    if (data[0].rating !== undefined) {
      let average = data.reduce((accumulator, currentObj) => {
        return accumulator + currentObj.rating
      }, 0) / data.length;

      average = Math.round(average);

      var review = { AverageRating: average, amount: data.length };
    } else {
      var review = { AverageRating: 0, amount: 0 }
    }
    if (data[0].rating !== undefined) {
      data.forEach((review) => {
        allReview.push({ rating: review.rating, date: review.date });
      });
    }
    this.setState({ Restaurant: restaurant, Review: review, allReview: allReview }, () => {
      console.log('this is my restaurant info state ', this.state);
    });
  }

updateDetailsClickStatus() {
    console.log('Deatils clicked');
    if (!this.state.ShowPhotoForm && !this.state.ShowReviewForm) {
      this.setState({
        Restaurant: this.state.Restaurant, Review: this.state.Review, ShowDetails: !this.state.ShowDetails,
        ShowReviewForm: this.state.ShowReviewForm, ShowPhotoForm: this.state.ShowPhotoForm, allReview: this.state.allReview
      });
    }
}

updateAddPhotoClickStatus() {
    console.log('Photo clicked')
    if (!this.state.ShowDetails && !this.state.ShowReviewForm) {
      this.setState({
        Restaurant: this.state.Restaurant, Review: this.state.Review, ShowDetails: this.state.ShowDetails,
        ShowReviewForm: this.state.ShowReviewForm, ShowPhotoForm: !this.state.ShowPhotoForm, allReview: this.state.allReview
      });
    }
}

updateWriteReviewClickStatus() {
    console.log('Review clicked')
    if (!this.state.ShowPhotoForm && !this.state.ShowDetails) {
      this.setState({
        Restaurant: this.state.Restaurant, Review: this.state.Review, ShowDetails: this.state.ShowDetails,
        ShowReviewForm: !this.state.ShowReviewForm, ShowPhotoForm: this.state.ShowPhotoForm, allReview: this.state.allReview
      });
    }
}


  render() {
    let stars =[];
    for (let i = 0; i < 5; i++) {
      if (this.state.Review.AverageRating > i) {
        stars.push(
          <span className={"Star-Rating-" + this.state.Review.AverageRating}>
            <svg viewBox="0 0 160 160" width="30" height="30">
              <path d="M110.6 0h-76.9c-18.6 0-33.7 15.1-33.7 33.7v76.9c0 18.6 15.1 33.7 33.7 33.7h76.9c18.6 0 33.7-15.1 33.7-33.7v-76.9c0-18.6-15.1-33.7-33.7-33.7z"/>
              <path d="M33.3,0.3C14.7,0.3-0.4,15.4-0.4,34V111c0,18.6,15.1,33.7,33.7,33.7h38.3V0.3H33.3z"/>
              <path fill="#fff" d="M72 19.3l13.6 35.4 37.9 2-29.5 23.9 9.8 36.6-31.8-20.6-31.8 20.6 9.8-36.6-29.5-23.9 37.9-2z"/>
            </svg>
          </span>
        );
      } else {
        stars.push(
          <span className={"Star-Rating-Blank"}>
            <svg viewBox="0 0 160 160" width="30" height="30">
              <path d="M110.6 0h-76.9c-18.6 0-33.7 15.1-33.7 33.7v76.9c0 18.6 15.1 33.7 33.7 33.7h76.9c18.6 0 33.7-15.1 33.7-33.7v-76.9c0-18.6-15.1-33.7-33.7-33.7z"/>
              <path d="M33.3,0.3C14.7,0.3-0.4,15.4-0.4,34V111c0,18.6,15.1,33.7,33.7,33.7h38.3V0.3H33.3z"/>
              <path fill="#fff" d="M72 19.3l13.6 35.4 37.9 2-29.5 23.9 9.8 36.6-31.8-20.6-31.8 20.6 9.8-36.6-29.5-23.9 37.9-2z"/>
            </svg>
          </span>
        );
      }
    }
    return (
      <div>

        <div>
          <span className="Restaurant-Title">
            {this.state.Restaurant.name}&ensp;
          </span>
          {this.state.Restaurant.claimed === 'Unclaimed'?
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="icon_svg_unclaim"><path d="M9 1C4.58 1 1 4.58 1 9s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 12.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm1.76-5.76c-.14.14-.3.28-.44.4-.12.09-.25.19-.32.29-.11.13-.18.4-.18.57 0 .23-.1.46-.27.63a.75.75 0 0 1-.55.24c-.48 0-.83-.45-.83-.86-.01-.54.19-1.1.52-1.5.19-.23.4-.42.54-.53.11-.1.21-.18.28-.27.35-.37.36-.94.03-1.29-.14-.15-.37-.22-.62-.22-.25.01-.48.11-.6.27a.42.42 0 0 0-.09.27c0 .43-.38.78-.83.78-.46 0-.83-.35-.83-.78 0-.44.14-.85.41-1.2.42-.55 1.1-.88 1.86-.91.77-.04 1.47.24 1.94.74.44.47.65 1.06.65 1.67 0 .61-.22 1.22-.67 1.7z"></path></svg>
            </span> :
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="icon_svg_claim"><path d="M9 1a8 8 0 1 0 0 16A8 8 0 0 0 9 1zm3.96 6.28l-4.808 4.807-3.112-3.11a.8.8 0 1 1 1.13-1.132l1.982 1.98 3.677-3.677a.8.8 0 1 1 1.13 1.13z"></path></svg>
            </span>}
            <span className="ClaimStatus">
            {this.state.Restaurant.claimed}
            </span>
        </div>

        <div className="Details-ReviewCount">
          <span className="Restaurant-Rating">
            {stars}
          </span>
          <span className="Review-Count-Details-Button">
            &ensp;{this.state.Review.amount}
            &nbsp;Reviews&emsp;
            <button type="button" onClick={this.updateDetailsClickStatus}>Details</button>
          </span>
          {this.state.ShowDetails ? <Details updateDetailsStatus={this.updateDetailsClickStatus} Reviews={this.state.allReview} /> : null}
        </div>

        <div>{this.state.Restaurant.price}
        &emsp;
          {this.state.Restaurant.category}
        </div>
        <div>
          <button className="review-button-info" type="button" onClick={this.updateWriteReviewClickStatus}>
            <span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="icon_svg_star"><path d="M8.94 1l2.373 5.387 5.187.758-3.75 3.67.928 5.077-4.737-2.907L4.367 16l.885-5.186-3.75-3.67 5.187-.757L8.94 1z"></path></svg></span>
            WriteReview</button>
          &emsp;
          {this.state.ShowReviewForm ? <WriteReview updateReviewFormStatus={this.updateWriteReviewClickStatus} name={this.state.Restaurant.name} /> : null}
          <button type="button" onClick={this.updateAddPhotoClickStatus}>AddPhoto</button>
          &emsp;
          {this.state.ShowPhotoForm ? <AddPhoto updatePhotoFormStatus={this.updateAddPhotoClickStatus} /> : null}
          <button type="button">save</button>
          &emsp;
          <button type="button">share</button>
        </div>
      </div>
    );
  }
}

export default RestaurantInfo;
