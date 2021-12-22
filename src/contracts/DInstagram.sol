pragma solidity ^0.5.0;

contract DInstagram {
    // Code goes here...
    string public name = "DInstagram";

    //Strore Images
    uint256 public imageCount = 0;
    mapping(uint256 => Image) public images;

    struct Image {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint256 _id,
        string _hash,
        string _description,
        uint256 _tipAmount,
        address payable _author
    );

    event ImageTipped(
        uint256 _id,
        string _hash,
        string _description,
        uint256 _tipAmount,
        address payable _author
    );

    //Create Images
    function uploadImage(string memory _imageHash, string memory _description)
        public
    {
        //Make sure image and description exist
        require(bytes(_imageHash).length > 0, "Image must not be empty");

        require(
            bytes(_description).length > 0,
            "Description must not be empty"
        );

        //Make sure uploader address exists
        require(
            msg.sender != address(0),
            "Address must not be a blank address"
        );

        //Increment image id
        imageCount++;

        //Add image to contract
        images[imageCount] = Image(
            imageCount,
            _imageHash,
            _description,
            0,
            msg.sender
        );

        //Create event that correspond to the creation of an image
        emit ImageCreated(imageCount, _imageHash, _description, 0, msg.sender);
    }

    //Tip Images
    function tipImageOwner(uint256 _id) public payable {
        require(_id > 0 && _id <= imageCount);
        //Fetch the image
        Image memory _image = images[_id];

        //Fetch the author
        address payable _author = _image.author;

        //Pay the author by sending them Ether
        address(_author).transfer(msg.value);

        //Update the tip amount of the post
        _image.tipAmount = _image.tipAmount + msg.value;

        //Update the image
        images[_id] = _image;

        //Create event that correspond to the tip of an image
        emit ImageCreated(
            _id,
            _image.hash,
            _image.description,
            _image.tipAmount,
            _author
        );
    }
}
