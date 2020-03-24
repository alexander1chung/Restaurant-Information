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

      if (average % 1 < 0.76 && average % 1 > 0.24) {
        average = Math.floor(average) + 0.5;
      } else { 
        average = Math.round(average);
      }

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
    const color = [
      "khaki",
      "gold",
      "darkorange",
      "orangered",
      "#d32323"
    ];
    for (let i = 0; i < 5; i++) {
      if (this.state.Review.AverageRating > i) {
        if (this.state.Review.AverageRating - i !== 0.5) {
          stars.push(
            <span className={"star-rating-" + Math.floor(this.state.Review.AverageRating)}>
              <svg viewBox="0 0 160 160" width="30" height="30">
                <path d="M110.6 0h-76.9c-18.6 0-33.7 15.1-33.7 33.7v76.9c0 18.6 15.1 33.7 33.7 33.7h76.9c18.6 0 33.7-15.1 33.7-33.7v-76.9c0-18.6-15.1-33.7-33.7-33.7z"/>
                <path d="M33.3,0.3C14.7,0.3-0.4,15.4-0.4,34V111c0,18.6,15.1,33.7,33.7,33.7h38.3V0.3H33.3z"/>
                <path fill="#fff" d="M72 19.3l13.6 35.4 37.9 2-29.5 23.9 9.8 36.6-31.8-20.6-31.8 20.6 9.8-36.6-29.5-23.9 37.9-2z" />
              </svg>
            </span>
          );
        } else {
          console.log('hello')
          stars.push(
            <span className={"star-rating-blank"}>
              <svg viewBox="0 0 160 160" width="30" height="30">
                <defs>
                  <linearGradient id="half_grad">
                    <stop offset="50%" stopColor={color[Math.floor(this.state.Review.AverageRating) - 1]}/>
                  </linearGradient>
                </defs>
                <path d="M110.6 0h-76.9c-18.6 0-33.7 15.1-33.7 33.7v76.9c0 18.6 15.1 33.7 33.7 33.7h76.9c18.6 0 33.7-15.1 33.7-33.7v-76.9c0-18.6-15.1-33.7-33.7-33.7z"/>
                <path d="M33.3,0.3C14.7,0.3-0.4,15.4-0.4,34V111c0,18.6,15.1,33.7,33.7,33.7h38.3V0.3H33.3z" fill="url(#half_grad)"/>
                <path fill="#fff" d="M72 19.3l13.6 35.4 37.9 2-29.5 23.9 9.8 36.6-31.8-20.6-31.8 20.6 9.8-36.6-29.5-23.9 37.9-2z" />
              </svg>
            </span>
          );
        }
      } else {
        stars.push(
          <span className={"star-rating-blank"}>
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
            <button className="details-button-info" type="button" onClick={this.updateDetailsClickStatus}>
              <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" class="icon_svg_bar"><path d="M9 11V5h2v6H9zM6 3h2v8H6V3zM3 7h2v4H3V7z"></path></svg></span>
              <span>Details</span>
            </button>
          </span>
          {this.state.ShowDetails ? <Details updateDetailsStatus={this.updateDetailsClickStatus} Reviews={this.state.allReview} /> : null}
        </div>

        <div className="price-category">
          {this.state.Restaurant.price}
          &emsp;
          {this.state.Restaurant.category}
        </div>
        <div>
          <button className="review-button-info" type="button" onClick={this.updateWriteReviewClickStatus}>
            <span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="icon_svg_star"><path d="M8.94 1l2.373 5.387 5.187.758-3.75 3.67.928 5.077-4.737-2.907L4.367 16l.885-5.186-3.75-3.67 5.187-.757L8.94 1z"></path></svg></span>
            <span className="review-info-text">Write a Review</span>
          </button>
          &emsp;
          {this.state.ShowReviewForm ? <WriteReview updateResInfoState={this.updateState} updateReviewFormStatus={this.updateWriteReviewClickStatus} name={this.state.Restaurant.name} /> : null}
          <button type="button" className="photo-button-info" onClick={this.updateAddPhotoClickStatus}>
            <span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="icon_svg_camera"><path d="M15 15H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2zM9 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path></svg></span>
            <span className="photo-info-text">Add Photo</span>
          </button>
          &emsp;
          {this.state.ShowPhotoForm ? <AddPhoto updatePhotoFormStatus={this.updateAddPhotoClickStatus} /> : null}
          <button className="share-button-info" type="button">
            <span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="icon_svg_share"><path d="M17.714 6.43L13 10.356v-3.03c-1 0-5.097 1.47-6.286 3.62.274-3.08 4.286-5.5 6.286-5.5V2.5l4.714 3.93zM3 4v10h11v-2.5l1-1V15H2V3h8.5l-1 1H3z"></path></svg></span>
            <span className="share-info-text">Share</span>
          </button>
          &emsp;
          <button className="save-button-info" type="button">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="icon_svg_save"><path d="M12 2H6a2 2 0 0 0-2 2v12l5-4 5 4V4a2 2 0 0 0-2-2z"></path></svg></span>
            <span className="save-info-text">Save</span>
          </button>
          <button className="Follow-button-info" type="button">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="icon_svg_plus"><path d="M16 10h-6v6H8v-6H2V8h6V2h2v6h6v2z"></path></svg></span>
            <span className="follow-info-text">Follow</span>
          </button>
        </div>
      </div>
    );
  }
}

export default RestaurantInfo;
