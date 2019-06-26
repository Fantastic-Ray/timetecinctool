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
 * Get Report List  Sample
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
//$serviceUrl = "https://mws.amazonservices.co.uk";
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
$serviceUrl = "https://mws.amazonservices.ca";
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
     AWS_ACCESS_KEY_ID, 
     AWS_SECRET_ACCESS_KEY, 
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
 /*$parameters = array (
   'Merchant' => MERCHANT_ID,
   'AvailableToDate' => new DateTime('now', new DateTimeZone('UTC')),
  'AvailableFromDate' => new DateTime('-6 months', new DateTimeZone('UTC')),
   'Acknowledged' => false, 
//   'MWSAuthToken' => '<MWS Auth Token>', // Optional
 );
// 
 
 $request = new MarketplaceWebService_Model_GetReportListRequest($parameters);*/
 $requestID = $_REQUEST["requestID"];
 //echo ("requestID" .  $requestID);
 $request = new MarketplaceWebService_Model_GetReportListRequest();
 $request->setMerchant(MERCHANT_ID);
 $request->setAvailableToDate(new DateTime('now', new DateTimeZone('UTC')));
 $request->setAvailableFromDate(new DateTime('-3 months', new DateTimeZone('UTC')));
 $request->setAcknowledged(false);
// $request->setMWSAuthToken('<MWS Auth Token>'); // Optional
 
 invokeGetReportList($service, $request,$requestID);
                                                                    
/**
  * Get Report List Action Sample
  * returns a list of reports; by default the most recent ten reports,
  * regardless of their acknowledgement status
  *   
  * @param MarketplaceWebService_Interface $service instance of MarketplaceWebService_Interface
  * @param mixed $request MarketplaceWebService_Model_GetReportList or array of parameters
  */
  function invokeGetReportList(MarketplaceWebService_Interface $service, $request,$requestID) 
  {
    $nowTime = new DateTime('NOW');
    $diff = date_sub($nowTime,new DateInterval('P0Y0DT0H30M'));
      try {
              $response = $service->getReportList($request);
              
                if ($response->isSetGetReportListResult()) { 
                    
                    $getReportListResult = $response->getGetReportListResult();
                    if ($getReportListResult->isSetNextToken()) 
                    {
                        
                         $getReportListResult->getNextToken();
                    }
                    if ($getReportListResult->isSetHasNext()) 
                    {
                        
                        $getReportListResult->getHasNext();
                    }
                    $reportInfoList = $getReportListResult->getReportInfoList();
                    foreach ($reportInfoList as $reportInfo) {
                        
                        if ($reportInfo->isSetReportId()) 
                        {
                           
                            $reportInfo->getReportId();
                        }
                        if ($reportInfo->isSetReportType()) 
                        {
                            
                            $reportInfo->getReportType();
                        }
                        if ($reportInfo->isSetReportRequestId()) 
                        {
                            
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
                        if ($reportInfo->isSetAvailableDate()) 
                        {
                           
                            $reportInfo->getAvailableDate()->format(DATE_FORMAT);
                        }
                        if ($reportInfo->isSetAcknowledged()) 
                        {
                            
                            $reportInfo->getAcknowledged();
                        }
                        if ($reportInfo->isSetAcknowledgedDate()) 
                        {
                           
                            $reportInfo->getAcknowledgedDate()->format(DATE_FORMAT);
                        }
                    }
                } 

     } catch (MarketplaceWebService_Exception $ex) {
         echo("Caught Exception: " . $ex->getMessage() );
         echo("Response Status Code: " . $ex->getStatusCode() );
         echo("Error Code: " . $ex->getErrorCode() );
         echo("Error Type: " . $ex->getErrorType() );
         echo("Request ID: " . $ex->getRequestId() );
         echo("XML: " . $ex->getXML()  );
         echo("ResponseHeaderMetadata: " . $ex->getResponseHeaderMetadata());
     }
 }
?>
