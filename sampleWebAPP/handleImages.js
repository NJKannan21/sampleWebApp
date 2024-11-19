$(document).ready(function(){
    const apiKey = "AFIPAxDmp5S8FnNDDLGAiWazSCctP2YW0prhEOMdriI";
    const imgPerPage = 15;
    let gridColumn = 3;
    let currentPage = 1;
    let apiUrl = "https://api.unsplash.com/photos?page=" + currentPage + "&per_page=" + imgPerPage + "&client_id=" + apiKey;

    $(window).scrollTop(0);
    getImages(apiUrl, gridColumn, apiKey);

    $(".pagination #prevButton, .pagination #nextButton").on("click", function(event) {
        $(window).scrollTop(0);

        if (this.id === "nextButton") {
            currentPage++;
        } else if (this.id === "prevButton" && currentPage != 1) {
            currentPage--;
        }

        if (currentPage === 1) {
            $('#prevButton').attr('disabled', true);
        } else {
            $('#prevButton').removeAttr('disabled');
        }

        apiUrl = "https://api.unsplash.com/photos?page=" + currentPage + "&per_page=" + imgPerPage + "&client_id=" + apiKey;
        getImages(apiUrl, gridColumn, apiKey);
    });

});

// Retrive image data
function getImages(apiUrl, gridColumn, apiKey) {

    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json",
        success: function(response) {
            // Handle the successful response
            $("#gallery").empty();
            let windowWidth = screen.width;
            
            if ( windowWidth <= 768) {
                gridColumn = 1;
            } else if (windowWidth <= 1024 && windowWidth > 768) {
                gridColumn = 2;
            }

            if (gridColumn) {
                for (let idx = 1; idx <= gridColumn; idx++) {
                    $("#gallery").append(`<div class="grid-column field-${idx}"></div>`);
                }
            }

            let imagePerSide = parseInt(response.length / gridColumn );
            let gridImgPerCol = imagePerSide;
            let position = ".field-1";

            if (imagePerSide) {
                for (let idx = 0; idx < response.length; idx++) {
                    let photo = response[idx];

                    if (gridImgPerCol === idx - 1) {
                        gridImgPerCol = gridImgPerCol + imagePerSide;
                        position = ".field-" + gridImgPerCol/imagePerSide;
                    }

                    if ( windowWidth > 1000) {
                        imgURL = photo.urls.small;
                    } else {
                        imgURL = photo.urls.full;
                    }

                    $("#gallery " + position).append(`
                        <div class="grid-item">
                            <img src="${imgURL}" alt="${photo.alt_description}" data-id="${photo.id}">
                            <div class="imgDetails d-none"></div>
                        </div>
                    `);
                }
            }

            if ($(".grid-item img").length) {
                $(".grid-item img").on("click", function() {
                    var detailElm = $(this).next();
                    const photoId = $(this).data("id");
                    const photoUrl = `https://api.unsplash.com/photos/${photoId}?client_id=${apiKey}`;
                    if ($(detailElm).hasClass('d-none')) {
                        $.get(photoUrl, function(photoDetails) {
                            $(detailElm).removeClass("d-none");

                            $(detailElm).html(`
                                <span class="badge bg-secondary fs-6">Author: ${photoDetails.user.name}</span>
                                <span class="badge bg-secondary fs-6">Description: ${photoDetails.alt_description || "N/A"}</span>
                                <span class="badge bg-secondary fs-6">Dimensions: ${photoDetails.width}x${photoDetails.height}</span>
                            `);
                        });
                    } else {
                        $(detailElm).animate({
                            height: 'toggle'
                        });
                    }
                });
            }
        },
        error: function(xhr, status, error) {
            // Handle the error response
            console.error("Error:", error);
        }
    });

}
