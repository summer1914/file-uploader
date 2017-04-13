/**
 * summer_jia@yeah.net
 */

/***
 usage:
  $(selector).chibiEvidenceFileUploader({
		'onUploadSuccess': function (){},   //单个文件上传成功回调函数
		'onUploadFail': function (){},   //单个函数上传失败回调
		'files': [{"name": "test.png", "url": "url", "size":"size"}]   //初始化文件
	});
 ***/

(function ($) {
	var configs = {
		'imgContainer': '.img-container',
		'uploadingPromptBox': '.uploader-prompt',
		'uploadingBar': '.uploading-bar',
		'fileInput': '.file-input',
		'templateHtml': '<div data-area-text="图片预览区" class="file-uploader-selector file-uploader file-gallery"><div class="uploader-prompt uploader-attention"><span></span></div><div class="file-upload-button"><div>上传图片 <span class="uploading-bar"></span></div><input class="file-input" title="evidence file input" multiple="multiple" type="file" name="evidence-file-input"></div><ul  role="region" aria-live="polite" aria-relevant="additions removals" class="file-upload-list-selector img-container file-upload-list"></ul></div>'
	};

	var uploadFile = function (file, $fileUploader, settings) {
		if (settings.uploadConfig.url) {
			uploadToServer(file, settings);
		} else {
			convertToObjectURL(file, settings);
		}

	};

	var uploadToServer = function (file, settings) {
		var $uploadingBar = $fileUploader.find(configs.uploadingBar);
		$uploadingBar.html('(' + file.name + '正在准备上传...)');

		var params = settings.uploadConfig.params;
		var formData = new FormData();
		formData.append('file', file, file.name);

		$.map(params, function(key, val) {
			formData.append(key, val);
		}

		$.ajax({
			type: 'POST',
			url: settings.uploadConfig.url,
			data: formData,
			contentType: false,
			processData: false,
			complete: function (res) {
				var re = JSON.parse(res.responseText);
				var file = {'name': file.name, 'size': file.size};
				if (re.code == 200) {
					file['url'] = re.url;
					settings.onUploadSuccess(file);
				} else {
					settings.onUploadFail(re);
				}

				$uploadingBar.html('');
			},
			xhr: function () {
				//upload Progress
				var xhr = $.ajaxSettings.xhr();
				if (xhr.upload) {
					xhr.upload.addEventListener('progress', function (event) {
						var percent = 0;
						var position = event.loaded || event.position;
						var total = event.total;
						if (event.lengthComputable) {
							percent = Math.ceil(position / total * 100);
						}

						$uploadingBar.html('(' + file.name + "上传中：" + percent + "%)");
					}, true);
				}
				return xhr;
			}
		});
	};

	var convertToObjectURL = function (file, settings) {
		var url = null;
		if (window.createObjectURL != undefined) {
			url = window.createObjectURL(file);
 		} else if (window.URL != undefined) {
 			url = window.URL.createObjectURL(file);
 		} else if (window.webkitURL != undefined) {
 			url = window.webkitURL.createObjectURL(file);
 		}

 		var file = {
 			'name': file.name,
 			'size': file.size,
 			'url': url
 		}
 		settings.onUploadSuccess(file);

 		return file;
	};

	var initFiles = function ($imgContainer, files) {
		$.map(files, function (file) {
			if (file.url){
				var size = file.size > 0 ? Math.ceil(file.size / 1024) : '未知';
				var imgHtml = '<li class="img-item">'
					+ '<div class="file-thumbnail-wrapper">'
					+ '<img class="file-thumbnail-selector"  src="' + file.url + '" />'
					+ '</div>'
					+ '<div class="file-file-info">'
					+ '<div class="file-file-name">'
					+ '<span class="file-upload-file-selector file-upload-file">' + file.name + '</span>'
					+ '</div>'
					+ '<input type="hidden" name="files[]" value="' + file.url + '" />'
					+ '<span class="file-upload-size-selector file-upload-size">' + size + ' kb</span>'
					+ '<button type="button" class="file-btn file-upload-delete-selector file-upload-delete">'
					+ '<i class="file-btn icon-trash" aria-label="Delete"></i>'
					+ '</button>'
					+ '</div>'
					+ '</li>';
				$imgContainer.append(imgHtml);
			}
		});
		$imgContainer.append('<input type="hidden" name="files[]" value="" />');
	};

	var uploadingPrompt = function ($uploadingPromptBox, text) {
		$uploadingPromptBox.find('span').text(text);
		setTimeout(function () {
			$uploadingPromptBox.find('span').text('');
		}, 7000);
	};

	var checkFileExt = function (filePath) {
		var validTypes = ['.png', '.gif', '.jpg', '.jpeg'];
		var extStart = filePath.lastIndexOf(".");
		var ext = filePath.substring(extStart, filePath.length).toLowerCase();

		if (validTypes.indexOf(ext) < 0) {
			return false;
		}

		return true;
	};

	var removeThisImg = function (thisBtn) {
		$(thisBtn).parents('li').remove();
	};

	$.fn.fileUploader = function (options) {
		var $fileUploader = this;

		var settings = $.extend({
			'files': [],
			'uploadConfig': {
				'url': '',
				'params': {}
			},
			'onUploadSuccess': function (file) {
				var imgHtml = '<li class="img-item">'
					+ '<div class="file-thumbnail-wrapper">'
					+ '<img class="file-thumbnail-selector"  src="//file.baixing.net/' + file.url + '" />'
					+ '</div>'
					+ '<div class="file-file-info">'
					+ '<div class="file-file-name">'
					+ '<span class="file-upload-file-selector file-upload-file">' + file.name + '</span>'
					+ '</div>'
					+ '<input type="hidden" name="files[]" value="//file.baixing.net/' + file.url + '" />'
					+ '<span class="file-upload-size-selector file-upload-size">' + Math.ceil(file.size / 1024) + 'kb</span>'
					+ '<button type="button" class="file-btn file-upload-delete-selector file-upload-delete">'
					+ '<i class="file-btn icon-trash" aria-label="Delete"></i>'
					+ '</button>'
					+ '</div>'
					+ '</li>';

				$fileUploader.find(configs.imgContainer).append(imgHtml);
			},
			'onUploadFail': function (re) {
				return re.message;
			}
		}, options);

		$fileUploader.html(configs.templateHtml);

		if (Array.isArray(settings.files) && settings.files.length > 0) {
			initFiles($fileUploader.find(configs.imgContainer), settings.files);
		}

		$fileUploader.find(configs.fileInput).change(function () {
			var filePath = $(this).val();
			for (var i = 0; i < this.files.length; i++) {
				var file = this.files[i];

				if (!checkFileExt(filePath)) {
					var text = "提醒：文件'" + file.name + "'格式不符合要求，未上传！合法格式：'.png', '.gif', '.jpg', '.jpeg'";
					uploadingPrompt($fileUploader.find(configs.uploadingPromptBox), text);
				} else {
					uploadFile(file, $fileUploader, settings);
				}
			}

			return true;
		});

		$fileUploader.on('click', '.file-upload-delete-selector', function () {
			removeThisImg(this);
		});

	};
})(jQuery);
