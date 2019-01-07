<?php
/** 
 *  PHP Version 5
 *
 *  @category    Amazon
 *  @package     MarketplaceWebService
 *  @copyright   Copyright 2009 Amazon Technologies, Inc.
 *  @link        http://aws.amazon.com
 *  @license     http://aws.amazon.com/apache2.0  Apache License, Version 2.0
 *  @version     2009-01-01
 */
/******************************************************************************* 

 *  Marketplace Web Service PHP5 Library
 *  Generated: Thu May 07 13:07:36 PDT 2009
 * 
 */

/**
 * Get Report Request List Sample
 */

include_once ('.config.inc.php'); 

/************************************************************************
* Uncomment to configure the client instance. Configuration settings
* are:
*
* - MWS endpoint URL
* - Proxy host and port.
* - MaxErrorRetry.
***********************************************************************/
// IMPORTANT: Uncomment the approiate line for the country you wish to
// sell in:
// United States:
//$serviceUrl = "https://mws.amazonservices.com";
// United Kingdom
$serviceUrl = "https://mws.amazonservices.co.uk";
// Germany
//$serviceUrl = "https://mws.amazonservices.de";
// France
//$serviceUrl = "https://mws.amazonservices.fr";
// Italy
//$serviceUrl = "https://mws.amazonservices.it";
// Japan
//$serviceUrl = "https://mws.amazonservices.jp";
// China
//$serviceUrl = "https://mws.amazonservices.com.cn";
// Canada
//$serviceUrl = "https://mws.amazonservices.ca";
// India
//$serviceUrl = "https://mws.amazonservices.in";

$config = array (
  'ServiceURL' => $serviceUrl,
  'ProxyHost' => null,
  'ProxyPort' => -1,
  'MaxErrorRetry' => 3,
);

/************************************************************************
 * Instantiate Implementation of MarketplaceWebService
 * 
 * AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY constants 
 * are defined in the .config.inc.php located in the same 
 * directory as this sample
 ***********************************************************************/
 $service = new MarketplaceWebService_Client(
     AWS_ACCESS_KEY_ID_EU, 
     AWS_SECRET_ACCESS_KEY_EU, 
     $config,
     APPLICATION_NAME,
     APPLICATION_VERSION);
 
/************************************************************************
 * Uncomment to try out Mock Service that simulates MarketplaceWebService
 * responses without calling MarketplaceWebService service.
 *
 * Responses are loaded from local XML files. You can tweak XML files to
 * experiment with various outputs during development
 *
 * XML files available under MarketplaceWebService/Mock tree
 *
 ***********************************************************************/
 // $service = new MarketplaceWebService_Mock();

/************************************************************************
 * Setup request parameters and uncomment invoke to try out 
 * sample for Get Report List Action
 ***********************************************************************/
 // @TODO: set request. Action can be passed as MarketplaceWebService_Model_GetReportListRequest
 // object or array of parameters
 $requestID = $_REQUEST["requestID"];
//echo nl2br("            ResponseMetadata\n" . $requestID);
 /*$parameters = array (
   'Merchant' => MERCHANT_ID,
   //'MWSAuthToken' => '<MWS Auth Token>', // Optional
 );*/
// $request = new MarketplaceWebService_Model_GetReportRequestListRequest($parameters);
$stack = array();
array_push($stack,$requestID);

$request = new MarketplaceWebService_Model_GetReportRequestListRequest();
$request->setMerchant(MERCHANTEU_ID);
//$request->setReportRequestIdList($stack);
//$request->setMWSAuthToken('amzn.mws.7cb3ae52-b407-31a3-4499-482ff57d7ad8'); // Optional
// 
invokeGetReportRequestList($service, $request,$requestID);

                                                                    
/**
  * Get Report List Action Sample
  * returns a list of reports; by default the most recent ten reports,
  * regardless of their acknowledgement status
  *   
  * @param MarketplaceWebService_Interface $service instance of MarketplaceWebService_Interface
  * @param mixed $request MarketplaceWebService_Model_GetReportList or array of parameters
  */
  function invokeGetReportRequestList(MarketplaceWebService_Interface $service, $request,$requestID) 
  {
      $nowTime = new DateTime('NOW');
      $diff = date_sub($nowTime,new DateInterval('P0Y0DT0H30M'));
      try {
              $response = $service->getReportRequestList($request);
              
               
                if ($response->isSetGetReportRequestListResult()) { 
                    $getReportRequestListResult = $response->getGetReportRequestListResult();
                    if ($getReportRequestListResult->isSetNextToken()) 
                    {
                        
                       $getReportRequestListResult->getNextToken();
                    }
                    if ($getReportRequestListResult->isSetHasNext()) 
                    {
                        
                        $getReportRequestListResult->getHasNext();
                    }
                    $reportRequestInfoList = $getReportRequestListResult->getReportRequestInfoList();

                    foreach ($reportRequestInfoList as $reportRequestInfo) {
                        //echo nl2br("                ReportRequestInfo\n");
                        if ($reportRequestInfo->isSetReportRequestId()) 
                          {
                              //echo nl2br("                    ReportRequestId\n");
                              //echo nl2br("                        " . $reportRequestInfo->getReportRequestId() . "\n");
                              if($reportRequestInfo->getReportRequestId() == $requestID){
                                echo nl2br("ReportRequestId Found" . $requestID . "\n" );
                                if($reportRequestInfo->isSetReportProcessingStatus()){
                                    $reportRequestInfo->getReportProcessingStatus();
                                     echo nl2br("ReportProcessingStatus" . $reportRequestInfo->getReportProcessingStatus() . "\n" );
                                }
                                if($reportRequestInfo->isSetGeneratedReportId()){
                                  echo nl2br("getGeneratedReportID Found!\n");
                                  echo nl2br($reportRequestInfo->getGeneratedReportId());
                                  return;
                                }
                                
                              }

                          }
                          if ($reportRequestInfo->isSetReportType()) 
                          {
                              
                             if( $reportRequestInfo->getReportType() == '_GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA_'){
                              //echo nl2br('nowTime' . $nowTime);
                             // echo nl2br('endDate' . $reportRequestInfo->getEndDate());
                             
                              
                              //$minutes   = round($diff / 60);
                              //echo nl2br('now time sub  M ' . $diff->format('Y-m-d H:i:s') . "\n");
                              if($diff < $reportRequestInfo->getCompletedDate()){
                               if($reportRequestInfo->isSetGeneratedReportId()){
                                  //echo nl2br("NowDate " . $nowTime->format('Y-m-d H:i:s'). "\n");
                                  echo nl2br("getCompletedDate " . $reportRequestInfo->getCompletedDate()->format('Y-m-d H:i:s') . "\n");
                                  echo nl2br("getMostRecentGeneratedReportID Found!");
                                  echo nl2br($reportRequestInfo->getGeneratedReportId());
                                  return;
                                }
                              }
                             }
                          }
                          // add end
                          
                    }
                    echo nl2br("None");
                } 


     } catch (MarketplaceWebService_Exception $ex) {
         echo("Caught Exception: " . $ex->getMessage() . "\n");
         echo("Response Status Code: " . $ex->getStatusCode() . "\n");
         echo("Error Code: " . $ex->getErrorCode() . "\n");
         echo("Error Type: " . $ex->getErrorType() . "\n");
         echo("Request ID: " . $ex->getRequestId() . "\n");
         echo("XML: " . $ex->getXML() . "\n");
         echo("ResponseHeaderMetadata: " . $ex->getResponseHeaderMetadata() . "\n");
     }
 }
 ?>
