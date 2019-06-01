import { Component, OnInit } from '@angular/core';
/*Dynamsoft Code*/
/*Dynamsoft.WebTwainEnv.Containers = [{ContainerId:'dwtcontrolContainer', Width:'300px', Height:'400px'}];
///
Dynamsoft.WebTwainEnv.Trial = true;
///
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;
///
Dynamsoft.WebTwainEnv.Debug = false;
///
Dynamsoft.WebTwainEnv.ResourcesPath = 'Resources';
*/




// console.log("------- 00001 -----")
Dynamsoft.WebTwainEnv.AutoLoad = true;
Dynamsoft.WebTwainEnv.Containers = [{ContainerId:'dwtcontrolContainer', Width: '120px', Height: '350px'},{ContainerId:'dwtcontrolContainerLargeViewer', Width: '270px', Height: '350px'}];
//Dynamsoft.WebTwainEnv.ProductKey = '170761D654E7043A9307D5858B9560BE2533ED519F0C9E18368780D9DD3583742533ED519F0C9E18E973734DC530F5A92533ED519F0C9E187BED26B011B086312533ED519F0C9E18EB1D5B3AA7F8D7A52533ED519F0C9E1841CCCF729E8987E82533ED519F0C9E189A23566C3C6905F22533ED519F0C9E18E4A85B09C9B231522533ED519F0C9E18A1C1624747E6CC672533ED519F0C9E18C7E3D33C0CC338CF2533ED519F0C9E18DDB9BA53F4A66F4C2533ED519F0C9E18EF5599A3B9F2A5472533ED519F0C9E189221437146935F0E2533ED519F0C9E182E8138F981284B352533ED519F0C9E1822EAACA25CEF9CF2E0000000';
Dynamsoft.WebTwainEnv.Trial = true;
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;
Dynamsoft.WebTwainEnv.Debug = false;
Dynamsoft.WebTwainEnv.ResourcesPath = 'Resources';
/*Dynamsoft Code*/
@Component({
  selector: 'app-dynamic-web-twain',
  templateUrl: './dynamic-web-twain.component.html',
  styleUrls: ['./dynamic-web-twain.component.styl']
})
export class DynamicWebTwainComponent implements OnInit {
	//static DWObject = null;
	//static DWObjectLargeViewer = null;
	CurrentPath = null;
	//twainSources: TwainSource[] = [];
	//selectedTwainSource:TwainSource = null;
	constructor(
    //private _pxService: PxService,
	) { 
		console.log('----constructor DynamicWebTwain-----')
		Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', this.OnWebTwainReady)
		
	}

	ngOnInit() {
		console.log('----ngOnInit DynamicWebTwain----')
		// Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', this.OnWebTwainReady)
		// this.OnWebTwainReady()
	}

	OnWebTwainReady(){
		console.log('---OnWebTwainReady-----')
		var _this = this;
		DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer') // create a thumbnail
    	DWObjectLargeViewer = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainerLargeViewer') // create a large viewer
		//DWObject.IfAllowLocalCache = true;

		DWObject.SetViewMode(1, 5) 
		DWObjectLargeViewer.SetViewMode(1, 1) // This is actually the default setting 
		DWObjectLargeViewer.MaxImagesInBuffer = 1 // Set it to hold one image only
		DWObject.RegisterEvent("OnMouseClick", showThumbnailView)

		DWObject.RegisterEvent('OnPostTransfer', showThumbnailView)

		function showThumbnailView(){
			var index = DWObject.CurrentImageIndexInBuffer;
			DWObject.CopyToClipboard(index) // Copy the image you just clicked on to the clipboard
			DWObjectLargeViewer.LoadDibFromClipboard() // Load the same image from clipboard into the large viewer
		}
	}

	ShowThumbnailView(){
		console.log('ShowThumbnailView');
		var index = DWObject.CurrentImageIndexInBuffer;
		DWObject.CopyToClipboard(index) // Copy the image you just clicked on to the clipboard
		DWObjectLargeViewer.LoadDibFromClipboard() // Load the same image from clipboard into the large viewer
	}

	AcquireImage(){
		if(DWObject) { 
			DWObject.IfDisableSourceAfterAcquire = true
			DWObject.SelectSource()
			DWObject.OpenSource() // You should customize the settings after opening a source
			DWObject.IfFeederEnabled = true // Use the document feeder to scan in batches 
			DWObject.IfDuplexEnabled = false // Scan in Simplex mode (only 1 side of the page) 
			DWObject.PixelType = EnumDWT_PixelType.TWPT_GRAY // Scan pages in GRAY 
			DWObject.Resolution = 200 // Scan pages in 200 DPI
			DWObject.AcquireImage()
		}
	}

	BrowseImage(){
		if(DWObject) { 
			DWObject.IfShowFileDialog = true;
			DWObject.LoadImageEx("", EnumDWT_ImageType.IT_ALL,BrowseImageSuccess,BrowseImageFail);
		}

		function BrowseImageSuccess(){
			var index = DWObject.CurrentImageIndexInBuffer;
			DWObject.CopyToClipboard(index) // Copy the image you just clicked on to the clipboard
			DWObjectLargeViewer.LoadDibFromClipboard() // Load the same image from clipboard into the large viewer
		}

		function BrowseImageFail(errorCode, errorString){
			console.log(errorString);
		}
	}

	EditImage(){
		if(DWObjectLargeViewer) {
			DWObjectLargeViewer.ShowImageEditor();
		}
	}

	RotateImage(){
		if(DWObject) { 
			//DWObject.Rotate(0,45,true); //rotate the 1st image in the buffer by 45 degrees
			DWObject.RotateLeft(DWObject.CurrentImageIndexInBuffer);
		}
		if(DWObjectLargeViewer) { 
			DWObjectLargeViewer.RotateLeft(DWObjectLargeViewer.CurrentImageIndexInBuffer);
		}
	}

	SaveToBMP(){
		DWObject.IfShowFileDialog = true;
    	DWObject.SaveAsBMP("",DWObject.CurrentImageIndexInBuffer);
	}

	SaveToJPEG(){
		DWObject.IfShowFileDialog = true;
    	DWObject.SaveAsJPEG("",DWObject.CurrentImageIndexInBuffer);
	}

	SaveToPNG(){
		DWObject.IfShowFileDialog = true;
   		DWObject.SaveAsPNG("",DWObject.CurrentImageIndexInBuffer);
	}

	SaveToTIFF(){
		DWObject.IfShowFileDialog = true;
    	DWObject.SaveAsTIFF("",DWObject.CurrentImageIndexInBuffer);
	}

	SaveToPDF(){
		DWObject.IfShowFileDialog = true;
    	DWObject.SaveAsPDF("",DWObject.CurrentImageIndexInBuffer);
	}

	SaveToMultiTIFF(){
		DWObject.IfShowFileDialog = true;
    	DWObject.SaveAllAsMultiPageTIFF("",DWObject.CurrentImageIndexInBuffer);
	}

	SaveToMultiPDF(){
		DWObject.IfShowFileDialog = true;
    	DWObject.SaveAllAsPDF("",DWObject.CurrentImageIndexInBuffer);
	}
	/*downloadPDFR() {
		var _this = this;
		_this.DWObject.Addon.PDF.Download(
			'http://' +location.host + _this.CurrentPath + 'Resources/addon/Pdf.zip',
			function () {//console.log('PDF dll is installed');
				document.getElementById('info').style.display = 'none';
			},
			function (errorCode, errorString) {
				console.log(errorString);
			}
		);
	};
	AcquireImage() {
        var param = {
            IfShowUI: false,
            IfFeederEnabled: true,
            Resolution: 200,
            IfDuplexEnabled: false,
            PixelType: 2
        };
        if (this.selectedTwainSource) {
            if (!this.DWObject.SelectSourceByIndex(this.selectedTwainSource.idx)
                || !this.DWObject.OpenSource()
                || !this.DWObject.AcquireImage(param, function () {
                }, function (errorCode, errorString) {
                    console.dir({ errorCode: errorCode, errorString: errorString });
                })) {
                console.dir({ errorCode: this.DWObject.ErrorCode, errorString: this.DWObject.ErrorString });
            }
        }
	};
	ngAfterViewInit() {
        var _this = this;
        Dynamsoft.WebTwainEnv.Load();
        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', function () {
            console.log("OnWebTwainReady");
			_this.CurrentPath = decodeURI(location.pathname).substring(0, decodeURI(location.pathname).lastIndexOf("/") + 1);
            _this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
            if (_this.DWObject) {
                for (var i = 0; i < _this.DWObject.SourceCount; i++) {
                    _this.twainSources.push({ idx: i, name: _this.DWObject.GetSourceNameItems(i) });
                }
                _this.DWObject.IfDisableSourceAfterAcquire = true;
                _this.DWObject.SetViewMode(2, 2);
            }
			
			//Make sure the PDF Rasterizer and OCR add-on are already installedsample
			if (!Dynamsoft.Lib.env.bMac) {
				var localPDFRVersion = _this.DWObject._innerFun('GetAddOnVersion', '["pdf"]');
				if (Dynamsoft.Lib.env.bIE) {
					localPDFRVersion = _this.DWObject.getSWebTwain().GetAddonVersion("pdf");
				}
				if (localPDFRVersion != Dynamsoft.PdfVersion) {
					var ObjString = [];
					document.getElementById('info').style.display = 'block';
				}
				else {

				}
			}
        });
	};
	LoadImages() {
		var _this = this;
		if (_this.DWObject) {
			var nCount = 0, nCountLoaded = 0, aryFilePaths = [];
			_this.DWObject.IfShowFileDialog = false;
			function ds_load_pdfa(bSave, filesCount, index, path, filename) {
				nCount = filesCount;
				if (nCount == -1) {
					Dynamsoft.Lib.detect.hideMask();
					return;
				}
				var filePath = path + "\\" + filename, _oFile = {_filePath:'',_fileIsPDF:false};
				_oFile._filePath = filePath;
				_oFile._fileIsPDF = false;
				if ((filename.substr(filename.lastIndexOf('.') + 1)).toLowerCase() == 'pdf') {
					_oFile._fileIsPDF = true;
				}
				aryFilePaths.push(_oFile);
				if (aryFilePaths.length == nCount) {
					var i = 0;
					function loadFileOneByOne() {
						if (aryFilePaths[i]._fileIsPDF) {
							_this.DWObject.Addon.PDF.SetResolution(200);
							_this.DWObject.Addon.PDF.SetConvertMode(1);
						}
						_this.DWObject.LoadImage(aryFilePaths[i]._filePath,
							function () {
								console.log('Load Image:' + aryFilePaths[i]._filePath + ' -- successful');
								i++;
								if (i != nCount)
									loadFileOneByOne();
							},
							function (errorCode, errorString) {
								alert('Load Image:' + aryFilePaths[i]._filePath + errorString);
							}
						);
					}
					loadFileOneByOne();
				}
			}
			_this.DWObject.RegisterEvent('OnGetFilePath', ds_load_pdfa);
			_this.DWObject.RegisterEvent('OnPostLoad', function (path, name, type) {
				nCountLoaded++;
				console.log('load' + nCountLoaded);
				if (nCountLoaded == nCount) {
					_this.DWObject.UnregisterEvent('OnGetFilePath', ds_load_pdfa);
					Dynamsoft.Lib.detect.hideMask();
				}
			});
			_this.DWObject.ShowFileDialog(false, "BMP, JPG, PNG, PDF and TIF | *.bmp;*.jpg;*.png;*.pdf;*.tif;*.tiff", 0, "", "", true, true, 0)
			Dynamsoft.Lib.detect.showMask();
		}
	};*/
}
declare var Dynamsoft;
declare var EnumDWT_PixelType;
declare var EnumDWT_ImageType;
declare var DWObject;
declare var DWObjectLargeViewer;

export interface TwainSource {
    idx: number;
    name: string;
}
